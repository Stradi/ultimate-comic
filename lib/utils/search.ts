import { IMAGE } from 'configs/ui';
import { runSQL } from '../database';
import { IComic, ITag } from '../database/models';
import { resizeImage } from './image';

type ComicSearchResult = IComic[];
type TagSearchResult = ITag[];

type SearchResult = {
  comics: ComicSearchResult;
  tags: TagSearchResult;
};

const searchComics = async (term: string, count = 10, skip = 0) => {
  const result = await runSQL(`
    SELECT 
      c.name as comic_name,
      c.slug as comic_slug,
      c.cover_image as comic_cover_image,
      i.issue_count as comic_issue_count
    FROM comic c
    JOIN (
      SELECT comic_id, COUNT(*) as issue_count FROM issue GROUP BY comic_id
    ) i ON i.comic_id = c.id
    WHERE name LIKE '%${term}%'
    LIMIT ${skip}, ${count};
  `);

  return {
    comics: result.map(
      (comic) =>
        ({
          name: comic.comic_name,
          slug: comic.comic_slug,
          coverImage: resizeImage(comic.comic_cover_image, IMAGE.SIZES.SMALL),
          issues: new Array(comic.comic_issue_count).fill(null),
        } as IComic)
    ),
    tags: [],
  } as SearchResult;
};

// TODO
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const searchTags = async (_term: string, _count = 10, _skip = 0) => {
  throw new Error('Not implemented');
};

// TODO
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const searchAll = async (_term: string, _count = 10, _skip = 0) => {
  throw new Error('Not implemented');
};

export { searchComics, searchTags, searchAll };
export { type ComicSearchResult, type TagSearchResult, type SearchResult };
