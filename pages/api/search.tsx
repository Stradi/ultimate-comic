import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, parseQuery } from '~/lib/utils/api';
import { ApiError } from '~/lib/utils/error';
import { handle } from '~/lib/utils/promise';
import {
  searchAll,
  searchComics,
  SearchResult,
  searchTags,
} from '~/lib/utils/search';

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = parseQuery(req.query, [
    'term',
    'secret',
    'count',
    'skip',
    'type',
  ]);

  if (!query.term) {
    return Promise.reject(
      new ApiError(
        400,
        'Insufficent query parameters.',
        "To use this route you need to define 'term' query parameter. The request you sent does not have a 'term' parameter.",
        "Include 'term' query parameter while sending the request."
      )
    );
  }

  let count = Number.parseInt(query.count as string);
  if (isNaN(count)) {
    count = 10;
  }

  let skip = Number.parseInt(query.skip as string);
  if (isNaN(skip)) {
    skip = 0;
  }

  if (!query.type) {
    return Promise.reject(
      new ApiError(
        400,
        'Insufficent query parameters.',
        "To use this route you need to define 'type' query parameter. The request you sent does not have a 'type' parameter.",
        "Include 'type' query parameter while sending the request."
      )
    );
  }

  if (
    query.type !== 'full' &&
    query.type !== 'comics' &&
    query.type !== 'tags'
  ) {
    return Promise.reject(
      new ApiError(
        401,
        'Invalid request.',
        "The 'type' provided does not valid.",
        "Include a valid 'type' query parameter while sending the request. Valid 'type' parameters are: ['full', 'comics', 'tags']."
      )
    );
  }

  let fn;
  switch (query.type) {
    case 'full':
      fn = searchAll;
      break;
    case 'comics':
      fn = searchComics;
      break;
    case 'tags':
      fn = searchTags;
      break;
  }

  const escapedTerm = (query.term as string).replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

  const [searchError, searchResult] = await handle<SearchResult>(
    fn(escapedTerm, count, skip)
  );

  if (searchError) return Promise.reject(searchError);

  return res.status(200).json(searchResult);
};

const handler = apiHandler({
  GET: handleGet,
});

export default handler;
