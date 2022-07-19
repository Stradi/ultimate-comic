import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '~/lib/database';
import { apiHandler, parseQuery } from '~/lib/utils/api';
import { ApiError } from '~/lib/utils/error';
import { handle } from '~/lib/utils/promise';
import {
  ComicSearchResult,
  isComicSearchResult,
  isSearchResult,
  isTagSearchResult,
  searchAll,
  searchComics,
  SearchResult,
  searchTags,
  TagSearchResult,
} from '~/lib/utils/search';

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = parseQuery(req.query, [
    'term',
    'secret',
    'fields',
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

  if (!query.secret && process.env.NODE_ENV !== 'development') {
    return Promise.reject(
      new ApiError(
        400,
        'Insufficent query parameters.',
        "To use this route you need to define 'secret' query parameter. The request you sent does not have a 'secret' parameter.",
        "Include 'secret' query parameter while sending the request."
      )
    );
  }

  if (
    query.secret !== process.env.REVALIDATION_SECRET &&
    process.env.NODE_ENV !== 'development'
  ) {
    return Promise.reject(
      new ApiError(
        401,
        'Invalid request.',
        "The 'secret' provided does not valid.",
        "Include a valid 'secret' query parameter while sending the request."
      )
    );
  }

  if (!query.fields) {
    return Promise.reject(
      new ApiError(
        400,
        'No fields to return.',
        "To use this route you need to define 'fields' query parameter. The request you sent does not have a 'fields' parameter.",
        "Include 'fields' parameters while sending the request."
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

  await connectToDatabase();

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

  const [searchError, searchResult] = await handle<
    ComicSearchResult | TagSearchResult | SearchResult
  >(fn(query.term as string, count, skip, query.fields as string));

  if (searchError) return Promise.reject(searchError);

  let responseJson = {
    comics: [],
    tags: [],
  } as SearchResult;

  if (isComicSearchResult(searchResult)) {
    responseJson.comics = searchResult;
  } else if (isTagSearchResult(searchResult)) {
    responseJson.tags = searchResult;
  } else if (isSearchResult(searchResult)) {
    responseJson = searchResult;
  }

  console.log(responseJson);

  return res.status(200).json(responseJson);
};

const handler = apiHandler({
  GET: handleGet,
});

export default handler;
