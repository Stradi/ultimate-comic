import { NextApiRequest, NextApiResponse } from 'next';
import {
  connectToDatabase,
  getComicById,
  getComicBySlug,
} from '../../../lib/database';
import { IComicDocument } from '../../../lib/database/models';
import { apiHandler, parseQuery } from '../../../lib/utils/api';
import { isValidObjectID } from '../../../lib/utils/database';
import { handle } from '../../../lib/utils/promise';

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const queryParams = parseQuery(req.query, ['slugOrId', 'fields']);

  const slugOrId = queryParams.slugOrId as string;
  const isObjectId = isValidObjectID(slugOrId);

  const fields = (queryParams.fields as string)?.split(',').join(' ');

  const findFn = isObjectId ? getComicById : getComicBySlug;

  await connectToDatabase();
  const [error, data] = await handle<IComicDocument>(findFn(slugOrId, fields));
  if (error) return Promise.reject(error);

  return res.status(200).json({ data });
};

const handler = apiHandler({
  GET: handleGet,
});

export default handler;
