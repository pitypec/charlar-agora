import mongoose from 'mongoose';

const connectToDb = () => {
  mongoose.connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    },
    (err) => {
      if (err) {
        throw new Error(err);
      }
    }
  );
};

export default connectToDb;
