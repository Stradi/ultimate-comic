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

const getPopulatableFields = (
  fields: string,
  populate: PopulationOption[]
): PopulationOption[] => {
  const available: PopulationOption[] = [];
  populate.forEach(
    (fieldToPopulate) =>
      fields.indexOf(fieldToPopulate.fieldName) > -1 &&
      available.push(fieldToPopulate)
  );

  return available;
};

const selectFromFields = (fields: string): object => {
  type ReturnType = { [key: string]: number | object };
  const selectObject: ReturnType = {};
  fields.split(' ').forEach((field) => {
    if (field.indexOf('.') === -1) {
      selectObject[field] = 1;
    } else {
      const splittedField = field.split('.');
      const fieldName = splittedField[0];
      const arrIdx = Number.parseInt(splittedField[1]);

      selectObject[fieldName] = {
        $arrayElemAt: [`$${fieldName}`, arrIdx],
      };
    }
  });

  return selectObject;
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

export { isValidObjectID, getPopulatableFields, selectFromFields, callDb };
