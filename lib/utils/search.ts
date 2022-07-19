import { getAllComics, getAllTags } from '../database';
import { IComicDocument, ITagDocument } from '../database/models';

import { handle } from './promise';

type ComicSearchResult = IComicDocument[];
type TagSearchResult = ITagDocument[];

type SearchResult = {
  comics: ComicSearchResult;
  tags: TagSearchResult;
};

const searchComics = async (
  term: string,
  count = 10,
  skip = 0,
  fields = 'name slug'
) => {
  const [error, results] = await handle(
    getAllComics(count, skip, fields, [], {
      name: new RegExp(term, 'i'),
    })
  );

  if (error) return Promise.reject(error);

  return Promise.resolve(results as ComicSearchResult);
};

const searchTags = async (
  term: string,
  count = 10,
  skip = 0,
  fields = 'name slug'
) => {
  const [error, results] = await handle(
    getAllTags(count, skip, fields, [], {
      name: new RegExp(term, 'i'),
    })
  );

  if (error) return Promise.reject(error);

  return Promise.resolve(results as TagSearchResult);
};

const searchAll = async (
  term: string,
  count = 10,
  skip = 0,
  fields = 'name slug'
) => {
  const [comicError, comics] = await handle(
    searchComics(term, count, skip, fields)
  );

  if (comicError) return Promise.reject(comicError);

  const [tagError, tags] = await handle(searchTags(term, count, skip, fields));

  if (tagError) return Promise.reject(tagError);

  return {
    comics,
    tags,
  } as SearchResult;
};

const isComicSearchResult = (
  obj: ComicSearchResult | TagSearchResult | SearchResult
): obj is ComicSearchResult => {
  return (obj as ComicSearchResult)[0].modelName === 'Comic';
};

const isTagSearchResult = (
  obj: ComicSearchResult | TagSearchResult | SearchResult
): obj is TagSearchResult => {
  return (obj as TagSearchResult)[0].modelName === 'Tag';
};

const isSearchResult = (
  obj: ComicSearchResult | TagSearchResult | SearchResult
): obj is SearchResult => {
  return (
    (obj as SearchResult).comics !== undefined &&
    (obj as SearchResult).tags !== undefined
  );
};

export {
  searchComics,
  searchTags,
  searchAll,
  isComicSearchResult,
  isTagSearchResult,
  isSearchResult,
};
export { type ComicSearchResult, type TagSearchResult, type SearchResult };
