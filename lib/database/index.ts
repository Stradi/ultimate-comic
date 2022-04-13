import mongoose from 'mongoose';
import { getPopulatableFields } from '../utils/database';
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
  skip = 0,
  fields = 'name slug isCompleted releaseDate coverImage summary',
  populate: string[] = []
): Promise<IComicDocument[]> => {
  const query = ComicModel.find({});
  query.limit(count);
  query.skip(skip);
  query.select(fields);

  const populatableFields = getPopulatableFields(fields, populate);
  populatableFields.forEach((fieldToPopulate) =>
    query.populate(fieldToPopulate)
  );

  return await query.exec();
};

const getComicById = async (
  id: string,
  fields = 'name slug isCompleted releaseDate coverImage summary',
  populate: string[] = []
): Promise<IComicDocument> => {
  const query = ComicModel.findById(id);
  query.select(fields);

  const populatableFields = getPopulatableFields(fields, populate);
  populatableFields.forEach((fieldToPopulate) =>
    query.populate(fieldToPopulate)
  );

  const result = await query.exec();

  if (result) {
    return Promise.resolve(result);
  } else {
    return Promise.reject(`${id} does not exists.`);
  }
};

const getComicBySlug = async (
  slug: string,
  fields = 'name slug isCompleted releaseDate coverImage summary',
  populate: string[] = []
): Promise<IComicDocument> => {
  const query = ComicModel.findOne({ slug });
  query.select(fields);

  const populatableFields = getPopulatableFields(fields, populate);
  populatableFields.forEach((fieldToPopulate) =>
    query.populate(fieldToPopulate)
  );

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
