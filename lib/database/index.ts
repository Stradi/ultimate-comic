import mongoose from 'mongoose';
import { ComicModel, IComicDocument } from './models';

const connectToDatabase = async (): Promise<void> => {
  if (mongoose.connections[0].readyState === 1) {
    return Promise.resolve();
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return Promise.reject("DATABASE_URL in environment file couldn't found");
  }

  try {
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 2000,
    });
    return Promise.resolve();
  } catch (error: unknown) {
    console.log(error);
    return Promise.reject(error);
  }
};

const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    return Promise.resolve();
  } catch (error: unknown) {
    return Promise.reject();
  }
};

const getAllComics = async (
  count = 20,
  skip = 0
): Promise<IComicDocument[]> => {
  const query = ComicModel.find({}).limit(count).skip(skip);
  return await query.exec();
};

const getComicById = async (id: string): Promise<IComicDocument> => {
  const query = ComicModel.findById(id);
  const result = await query.exec();

  if (result) {
    return Promise.resolve(result);
  } else {
    return Promise.reject(`${id} does not exists.`);
  }
};

const getComicBySlug = async (slug: string): Promise<IComicDocument> => {
  const query = ComicModel.findOne({ slug });
  const result = await query.exec();

  if (result) {
    return Promise.resolve(result);
  } else {
    return Promise.reject(`${slug} does not exists.`);
  }
};

export {
  connectToDatabase,
  disconnectFromDatabase,
  getAllComics,
  getComicById,
  getComicBySlug,
};
