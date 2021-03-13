import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    message: {
      type: String
    },
    images: [
      {
        secure_url: {
          type: String,
          required: true
        },
        publicId: {
          type: String,
          required: true
        }
      }
    ],
    likeCount: {
      type: Number,
      default: 0
    },
    commentCount: {
      type: Number,
      default: 0
    },
    comments: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'user'
        },
        message: {
          type: String
        },
        createdAt: {
          type: Date,
          default: new Date()
        }
      }
    ],
    likes: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'user'
        },
        createdAt: {
          type: Date,
          default: new Date()
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model('post', PostSchema);

export default Post;
