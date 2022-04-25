import mongoose from 'mongoose';
import { getPopulatableFields, getPopulateFields } from '../utils/database';
import { ApiError, DatabaseError } from '../utils/error';
import { handle } from '../utils/promise';
import {
  ComicModel,
  IComicDocument,
  IIssueDocument,
  IssueModel,
} from './models';

const connectToDatabase = async (): Promise<void> => {
  if (mongoose.connections[0].readyState === 1) {
    return Promise.resolve();
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return Promise.reject(
      new DatabaseError(
        "Connection string couldn't found.",
        "Connection string for connecting to database couldn't found on any '.env*' files.",
        'Provide a connection string in .env* file.'
      )
    );
  }

  try {
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 2000,
    });
    return Promise.resolve();
  } catch (error: unknown) {
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

//TODO: Add sort and sort by option

const getAllComics = async (
  count = 20,
  skip = 0,
  fields = 'name slug isCompleted releaseDate coverImage summary',
  populate: PopulationOption[] = []
): Promise<IComicDocument[]> => {
  const query = ComicModel.find({});
  if (count !== -1) {
    query.limit(count);
  }
  query.skip(skip);
  query.select(fields);

  const populatableFields = getPopulatableFields(fields, populate);
  populatableFields.forEach((fieldToPopulate) =>
    query.populate({
      path: fieldToPopulate.fieldName,
      select: getPopulateFields(fieldToPopulate.fields),
    })
  );

  return await query.exec();
};

const getComicById = async (
  id: string,
  fields = 'name slug isCompleted releaseDate coverImage summary',
  populate: PopulationOption[] = []
): Promise<IComicDocument> => {
  const query = ComicModel.findById(id);
  query.select(fields);

  const populatableFields = getPopulatableFields(fields, populate);
  populatableFields.forEach((fieldToPopulate) =>
    query.populate({
      path: fieldToPopulate.fieldName,
      select: getPopulateFields(fieldToPopulate.fields),
    })
  );

  const result = await query.exec();

  if (result) {
    return Promise.resolve(result);
  } else {
    return Promise.reject(
      new ApiError(
        404,
        `'${id}' does not exists.`,
        `There is no matching document that has '_id=${id}'.`,
        `Enter a valid '_id'`
      )
    );
  }
};

const getComicBySlug = async (
  slug: string,
  fields = 'name slug isCompleted releaseDate coverImage summary',
  populate: PopulationOption[] = []
): Promise<IComicDocument> => {
  const query = ComicModel.findOne({ slug });
  query.select(fields);

  const populatableFields = getPopulatableFields(fields, populate);
  populatableFields.forEach((fieldToPopulate) => {
    query.populate({
      path: fieldToPopulate.fieldName,
      select: getPopulateFields(fieldToPopulate.fields),
    });
  });

  const result = await query.exec();

  if (result) {
    return Promise.resolve(result);
  } else {
    return Promise.reject(
      new ApiError(
        404,
        `'${slug}' does not exists.`,
        `There is no matching document that has 'slug=${slug}'.`,
        `Enter a valid 'slug'`
      )
    );
  }
};

const getIssueBySlug = async (
  comicSlug: string,
  issueSlug: string
): Promise<IIssueDocument> => {
  const [error, data] = await handle<IComicDocument>(
    getComicBySlug(comicSlug, '')
  );
  if (error) return Promise.reject(error);

  const query = IssueModel.findOne({ slug: issueSlug, comic: data._id });
  const result = await query.exec();
  if (result) {
    return Promise.resolve(result);
  } else {
    return Promise.reject(
      new ApiError(
        404,
        `'${comicSlug}' has no issue named '${issueSlug}'.`,
        `There is no matching document that has 'slug=${issueSlug}' and 'comicId=${data._id}'`,
        `Enter a valid 'comicSlug' and 'issueSlug'`
      )
    );
  }
};
export {
  connectToDatabase,
  disconnectFromDatabase,
  getAllComics,
  getComicById,
  getComicBySlug,
  getIssueBySlug,
};
