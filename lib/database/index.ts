import mongoose from 'mongoose';
import { getPopulatableFields } from '../utils/database';
import { ApiError, DatabaseError } from '../utils/error';
import { handle } from '../utils/promise';
import {
  ComicModel,
  IComicDocument,
  IIssueDocument,
  IssueModel,
  ITagDocument,
  TagModel,
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

const getAllComics = async (
  count = 20,
  skip = 0,
  fields = 'name slug isCompleted releaseDate coverImage summary',
  populate: PopulationOption[] = [],
  filter = {},
  sort: SortOption<IComicDocument> = {}
): Promise<IComicDocument[]> => {
  const query = ComicModel.find(filter, fields);
  if (count !== -1) {
    query.limit(count);
  }
  query.skip(skip);
  query.sort(sort);

  const populatableFields = getPopulatableFields(fields, populate);
  populatableFields.forEach((fieldToPopulate) =>
    query.populate({
      path: fieldToPopulate.fieldName,
      select: fieldToPopulate.fields,
    })
  );

  return await query.exec();
};

const getComicById = async (
  id: string,
  fields = 'name slug isCompleted releaseDate coverImage summary',
  populate: PopulationOption[] = []
): Promise<IComicDocument> => {
  const query = ComicModel.findById(id, fields);

  const populatableFields = getPopulatableFields(fields, populate);
  populatableFields.forEach((fieldToPopulate) =>
    query.populate({
      path: fieldToPopulate.fieldName,
      select: fieldToPopulate.fields,
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
  const query = ComicModel.find({ slug }, fields);

  const populatableFields = getPopulatableFields(fields, populate);
  populatableFields.forEach((fieldToPopulate) => {
    query.populate({
      path: fieldToPopulate.fieldName,
      select: fieldToPopulate.fields,
    });
  });

  const result = await query.exec();

  if (result) {
    return Promise.resolve(result[0]);
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

const getAllIssues = async (
  count = 20,
  skip = 0,
  fields = 'name slug',
  populate: PopulationOption[] = [],
  filter = {},
  sort: SortOption<IIssueDocument> = {}
): Promise<IIssueDocument[]> => {
  const query = IssueModel.find(filter, fields);
  if (count !== -1) {
    query.limit(count);
  }
  query.skip(skip);
  query.sort(sort);

  const populatableFields = getPopulatableFields(fields, populate);
  populatableFields.forEach((fieldToPopulate) =>
    query.populate({
      path: fieldToPopulate.fieldName,
      select: fieldToPopulate.fields,
    })
  );

  return await query.exec();
};

const getIssueById = async (
  id: string,
  fields = 'name slug createdAt',
  populate: PopulationOption[] = []
): Promise<IIssueDocument> => {
  const query = IssueModel.findOne({ _id: id }, fields);

  const populatableFields = getPopulatableFields(fields, populate);
  populatableFields.forEach((fieldToPopulate) => {
    query.populate({
      path: fieldToPopulate.fieldName,
      select: fieldToPopulate.fields,
    });
  });

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

const getIssueBySlug = async (
  comicSlug: string,
  issueSlug: string,
  fields = 'name slug createdAt',
  populate: PopulationOption[] = []
): Promise<IIssueDocument> => {
  const [error, data] = await handle<IComicDocument>(
    getComicBySlug(comicSlug, '')
  );
  if (error) return Promise.reject(error);

  const query = IssueModel.findOne(
    { slug: issueSlug, comic: data._id },
    fields
  );

  const populatableFields = getPopulatableFields(fields, populate);
  populatableFields.forEach((fieldToPopulate) => {
    query.populate({
      path: fieldToPopulate.fieldName,
      select: fieldToPopulate.fields,
    });
  });

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

const getLatestIssues = async (
  count = 20,
  skip = 0,
  fields = 'name slug createdAt',
  populate: PopulationOption[] = [],
  filter = {},
  sort: SortOption<IIssueDocument> = {}
): Promise<IIssueDocument[]> => {
  const query = IssueModel.find(filter, fields);
  if (count !== -1) {
    query.limit(count);
  }
  query.skip(skip);
  query.sort(sort);

  const populatableFields = getPopulatableFields(fields, populate);
  populatableFields.forEach((fieldToPopulate) => {
    query.populate({
      path: fieldToPopulate.fieldName,
      select: fieldToPopulate.fields,
    });
  });

  return await query.exec();
};

const getAllTags = async (
  count = 20,
  skip = 0,
  fields = 'name slug comics createdAt updatedAt',
  populate: PopulationOption[] = [],
  filter = {},
  sort: SortOption<ITagDocument> = {}
): Promise<ITagDocument[]> => {
  const query = TagModel.find(filter, fields);
  if (count !== -1) {
    query.limit(count);
  }

  query.skip(skip);
  query.sort(sort);

  const populatableFields = getPopulatableFields(fields, populate);
  populatableFields.forEach((fieldToPopulate) =>
    query.populate({
      path: fieldToPopulate.fieldName,
      select: fieldToPopulate.fields,
    })
  );

  return await query.exec();
};

const getTagBySlug = async (
  slug: string,
  fields = 'name slug comics createdAt updatedAt',
  comicFields = '',
  count = 20,
  skip = 0
): Promise<ITagDocument> => {
  const tag = await TagModel.findOne({ slug }, fields);
  if (!tag) {
    return Promise.reject(
      new ApiError(
        404,
        `'${slug}' does not exists.`,
        `There is no matching document that has 'slug=${slug}'.`,
        `Enter a valid 'slug'`
      )
    );
  }

  const comicsQuery = ComicModel.find(
    {
      tags: {
        $in: tag._id,
      },
    },
    comicFields
  );

  comicsQuery.limit(count);
  comicsQuery.skip(skip);

  const comics = await comicsQuery.exec();
  tag.comics = comics;

  return Promise.resolve(tag);
};

export {
  connectToDatabase,
  disconnectFromDatabase,
  getAllComics,
  getComicById,
  getComicBySlug,
  getAllIssues,
  getIssueById,
  getIssueBySlug,
  getLatestIssues,
  getAllTags,
  getTagBySlug,
};
