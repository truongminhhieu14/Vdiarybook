import mongoose, { Schema, Types } from "mongoose";


export interface IrefreshToken extends Document {
    _id: Types.ObjectId,
    userId: Types.ObjectId,
    token: string
}

const refreshTokenSchema = new Schema<IrefreshToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true }
  },
  { timestamps: true }
)

export const RefreshToken = mongoose.model<IrefreshToken>('RefreshToken', refreshTokenSchema)