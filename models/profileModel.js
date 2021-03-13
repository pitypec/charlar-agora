import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    firstName: {
      type: String
    },
    middleName: {
      type: String
    },
    lastName: {
      type: String
    },
    location: {
      type: String
    },
    followersCount: {
      type: Number,
      default: 0
    },
    following: [
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
    ],
    followers: [
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

const Profile = mongoose.model('profile', profileSchema);

export default Profile;
