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

  return Promise.resolve({
    comics: results,
    tags: [],
  } as SearchResult);
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

  return Promise.resolve({
    comics: [],
    tags: results,
  } as SearchResult);
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
    comics: comics.comics,
    tags: tags.tags,
  } as SearchResult;
};

export { searchComics, searchTags, searchAll };
export { type ComicSearchResult, type TagSearchResult, type SearchResult };
