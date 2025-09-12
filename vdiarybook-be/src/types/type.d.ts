import { IPost } from "../../modules/post/post.model";

declare module "express-serve-static-core" {
  interface Request {
    post?: IPost;
  }
}