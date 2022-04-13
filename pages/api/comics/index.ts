import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, getAllComics } from '../../../lib/database';
import { IComicDocument } from '../../../lib/database/models';
import { apiHandler, parseQuery } from '../../../lib/utils/api';
import { handle } from '../../../lib/utils/promise';

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const queryParams = parseQuery(req.query, [
    'count',
    'skip',
    'fields',
    'populate',
  ]);

  const count = Number.parseInt(queryParams.count as string);
  const skip = Number.parseInt(queryParams.skip as string);
  const fields = (queryParams.fields as string)?.split(',').join(' ');
  const populate = (queryParams.populate as string)?.split(',');

  await connectToDatabase();
  const [error, data] = await handle<IComicDocument[]>(
    getAllComics(count, skip, fields, populate)
  );
  if (error) return Promise.reject(error);

  res.status(200).json({ data });
};

const handler = apiHandler({
  GET: handleGet,
});

export default handler;
