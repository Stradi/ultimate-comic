import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase, getAllComics } from '../../../lib/database';
import { IComicDocument } from '../../../lib/database/models';
import { apiHandler, parseQuery } from '../../../lib/utils/api';
import { handle } from '../../../lib/utils/promise';

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const queryParams = parseQuery(req.query, ['count', 'skip']);

  let count = Number.parseInt(queryParams.count as string);
  let skip = Number.parseInt(queryParams.skip as string);
  if (isNaN(count) || count === 0) count = 20;
  if (isNaN(skip)) skip = 0;

  await connectToDatabase();
  const [error, data] = await handle<IComicDocument[]>(
    getAllComics(count, skip)
  );
  if (error) return Promise.reject(error);

  res.status(200).json({ data });
};

const handler = apiHandler({
  GET: handleGet,
});

export default handler;
