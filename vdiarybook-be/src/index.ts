import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db';
import apiRoutes from "./modules/"

import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger';
import { defaultErrorHandler } from './middleware/error.middleware';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Comment } from './modules/comment/comment.model';
import { Post } from './modules/post/post.model';
import { Notification } from './modules/notification/notification.model';
import { initFolder } from './utils/file';
import { Message } from './modules/message/message.model';
import { Conversation } from './modules/conversation/conversation.model';

dotenv.config();

const app = express();

initFolder();

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use("/api", apiRoutes);
app.use(defaultErrorHandler);

const users: { [key: string]: { socketid: string } } = {}

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL
  }
})

io.on('connection', (socket) => {
  const userId = socket.handshake.query?.userId as string
  users[userId] = {socketid: socket.id}
  console.log("User connected", userId, socket.id)
  console.log(users)
  socket.on("disconnect", () => {
    console.log("User disconnected", userId, socket.id)
    delete users[userId]
  })
  socket.on("send-comment", async (payload) => {
    const {text, postId, author, parentId, mentions = []} = payload
    const newComment = await Comment.create({
      text, 
      postId,
      author,
      parentId: parentId || null,
      mentions,
      likes: []
    })
    const populatedComment = await Comment.findById(newComment._id).populate('author', 'name avatar');
    if (!populatedComment) {
    console.error("Comment not found after creation.");
    return;
  }
    if (parentId) {
    io.emit("new-child-comment", {
      parentCommentId: parentId,
      newComment: populatedComment,
    });
  } else {
    io.emit(`new-comment-${postId}`, populatedComment);
  }
  
  const post = await Post.findById(postId);
  if (post && post.author.toString() !== author) {
    
    const notification = await Notification.create({
      receiverId: post.author,
      senderId: author,
      type: "comment",
      postId,
      message: `${(populatedComment.author as any).name} đã bình luận bài viết của bạn.`,
      isRead: false
    });

    const populatedNotification = await Notification.findById(notification._id).populate('senderId',  'name avatar')

    const receiver = users[post.author.toString()];
    if (receiver) {
      io.to(receiver.socketid).emit("new-notification", populatedNotification);
    }
  }
  
      // Gửi riêng đến từng user được "mention"
    mentions.forEach((userId: string) => {
      const user = users[userId]
      if (user) {
        io.to(user.socketid).emit('mentioned-comment', newComment)
      }
    })  
  })

  socket.on("update-comment", async (payload) => {
    const { commentId, text, author } = payload;
    const updatedComment = await Comment.findByIdAndUpdate(commentId, {text}, {new: true}).populate("author", "name avatar");

    io.emit("updated-comment", updatedComment);
  })
  socket.on("start-typing-comment", ({postId}) => {
    socket.to(postId).emit("user-typing-comment", {userId});
  })
  socket.on("stop-typing-comment", ({ postId }) => {
    socket.to(postId).emit("user-stop-typing-comment", { userId });
  });
  socket.on("join-comment-room", (postId) => {
    socket.join(postId);
  });
  socket.on("disconnect", () => {
    delete users[userId];
  });

  socket.on("send-message", async (msg) => {
    const { conversation, senderId, receiverId } = msg
    const resend_msg = await Message.create(msg)
    await Conversation.findByIdAndUpdate(conversation, {
    last_message: resend_msg._id,
    updatedAt: new Date()
  });
    if (users[senderId]) {
      io.to(users[senderId].socketid).emit("resend-message", resend_msg);
    }
    if(users[receiverId]) socket.to(users[receiverId].socketid).emit("new-message", resend_msg)
      console.log("message", resend_msg);
    // Lưu message vào cơ sở dữ liệu
      
  })
})

const PORT = process.env.PORT || 8080 || "0.0.0.0";


connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log("Connected to DB"); 
    console.log("Server is running",PORT);
  });
}).catch((err) => {
  console.error("Failed to connect to DB:", err);
});
