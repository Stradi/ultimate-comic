import mongoose from 'mongoose';

let __DBCONNECTION = {};

const connectToDatabase = async (): Promise<void> => {
  if (__DBCONNECTION) {
    return Promise.resolve();
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return Promise.reject("DATABASE_URL in environment file couldn't found");
  }

  try {
    const conn = await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 2000,
    });
    __DBCONNECTION = conn.connection;
    return Promise.resolve();
  } catch (error: any) {
    console.log(error);
    return Promise.reject(error);
  }
};

const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    return Promise.resolve();
  } catch (error: any) {
    return Promise.reject();
  }
};

export { connectToDatabase, disconnectFromDatabase };
