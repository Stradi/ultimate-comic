import { Types } from 'mongoose';

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

export { isValidObjectID, getPopulatableFields };
