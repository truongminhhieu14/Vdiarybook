import mongoose, { Document, ObjectId, Schema } from "mongoose"

export interface IComment extends Document {
    text: string
    author: ObjectId
    postId: ObjectId
    parentId: ObjectId
    mentions: string[] 
    likes: string[]
}


const commentSchema = new Schema<IComment>(
    {
        text: {type: String, require: true},
        author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        postId: {type: Schema.Types.ObjectId, ref: 'Post', required: true},
        parentId: {type: Schema.Types.ObjectId, ref: 'Comment', default: null},
        mentions: [{type: Schema.Types.ObjectId, ref: 'User'}],
        likes: [{type: Schema.Types.ObjectId, ref: 'User'}]
    },
    {timestamps: true}
)

export const Comment = mongoose.model<IComment>('Comment', commentSchema);