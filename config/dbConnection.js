import mongoose from "mongoose";

mongoose.set("strictQuery", false); // strict mode disabled

const connectionToDB = async () => {
  try {
    const { connection } = await mongoose.connect(
      process.env.MONGO_URI || `mongodb://127.0.0.1:27017/lms`
    );

    if (connection) {
      console.log(`Connected to MongoDB: ${connection.host}`);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectionToDB;
