import { getAllComics, getAllTags } from '../database';
import { handle } from './promise';

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

  return Promise.resolve(results);
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

  return Promise.resolve(results);
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
  };
};

export { searchComics, searchTags, searchAll };
