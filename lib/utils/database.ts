import { Types } from 'mongoose';
import { connectToDatabase } from '../database';
import { handle } from './promise';

const isValidObjectID = (str: string): boolean => {
  try {
    const objectId = new Types.ObjectId(str);
    return str === objectId.toString();
  } catch (e: unknown) {
    return false;
  }
};

const getPopulatableFields = (fields: string, populate: string[]): string[] => {
  const available: string[] = [];
  populate.forEach(
    (fieldToPopulate) =>
      fields.indexOf(fieldToPopulate) > -1 && available.push(fieldToPopulate)
  );

  return available;
};

const callDb = async <T>(
  promise: Promise<T>,
  serialize = false
): Promise<T> => {
  await connectToDatabase();
  const [error, data] = await handle<T>(promise);
  if (error) return Promise.reject(error);

  if (serialize) return JSON.parse(JSON.stringify(data as T));
  else return data as T;
};

export { isValidObjectID, getPopulatableFields, callDb };
