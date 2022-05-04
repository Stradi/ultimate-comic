import { access } from 'fs/promises';
import path from 'path';
import { SEO } from '../../configs/seo';
import { getAllComics, getAllTags } from '../database';
import { IIssueDocument } from '../database/models';
import { callDb } from './database';
import { DatabaseError } from './error';
import {
  createDirectoryIfNotExits,
  deleteAllFilesFromDirectory,
  getFileContent,
  writeToFile,
} from './fs';
import { handle } from './promise';

//TODO: REFACTOR!

const sitemapCachePath = path.resolve(process.cwd(), 'public', 'sitemap');
const otherPages = [
  `${SEO.URL}`,
  `${SEO.URL}/all-comics/a`,
  `${SEO.URL}/all-comics/b`,
  `${SEO.URL}/all-comics/c`,
  `${SEO.URL}/all-comics/d`,
  `${SEO.URL}/all-comics/e`,
  `${SEO.URL}/all-comics/f`,
  `${SEO.URL}/all-comics/g`,
  `${SEO.URL}/all-comics/h`,
  `${SEO.URL}/all-comics/i`,
  `${SEO.URL}/all-comics/j`,
  `${SEO.URL}/all-comics/k`,
  `${SEO.URL}/all-comics/l`,
  `${SEO.URL}/all-comics/m`,
  `${SEO.URL}/all-comics/n`,
  `${SEO.URL}/all-comics/o`,
  `${SEO.URL}/all-comics/p`,
  `${SEO.URL}/all-comics/q`,
  `${SEO.URL}/all-comics/r`,
  `${SEO.URL}/all-comics/s`,
  `${SEO.URL}/all-comics/t`,
  `${SEO.URL}/all-comics/u`,
  `${SEO.URL}/all-comics/v`,
  `${SEO.URL}/all-comics/w`,
  `${SEO.URL}/all-comics/x`,
  `${SEO.URL}/all-comics/y`,
  `${SEO.URL}/all-comics/z`,
  `${SEO.URL}/popular-comics`,
];

const getSitemap = async (index?: number) => {
  const filename = index !== undefined ? `sitemap-${index}.xml` : 'sitemap.xml';
  const [generateError] = await handle(generateSitemapIfNotExists(filename));
  if (generateError) {
    return Promise.reject(generateError);
  }

  const [fileContentError, content] = await handle(
    getFileContent(path.join(sitemapCachePath, filename))
  );
  if (fileContentError) {
    return Promise.reject(fileContentError);
  }

  return Promise.resolve(content);
};

const generateSitemapIfNotExists = async (filename: string) => {
  const [createDirError] = await handle(
    createDirectoryIfNotExits(sitemapCachePath)
  );
  if (createDirError) {
    return Promise.reject(createDirError);
  }

  const [error] = await handle(
    access(path.resolve(sitemapCachePath, filename))
  );

  if (error) {
    const [clearDirError] = await handle(
      deleteAllFilesFromDirectory(sitemapCachePath)
    );
    if (clearDirError) {
      return Promise.reject(clearDirError);
    }

    const [createSitemapsError] = await handle(generateSitemaps());
    if (createSitemapsError) {
      return Promise.reject(createSitemapsError);
    }
  }

  return Promise.resolve();
};

const generateSitemaps = async () => {
  const [comicError, comics] = await handle(
    callDb(
      getAllComics(-1, 0, 'slug issues -_id', [
        {
          fieldName: 'issues',
          fields: 'slug -_id',
        },
      ]),
      true
    )
  );
  if (comicError) {
    return Promise.reject(
      new DatabaseError(comicError.name, comicError.message, 'Wait')
    );
  }

  const [tagError, tags] = await handle(callDb(getAllTags(-1, 0, 'slug -_id')));
  if (tagError) {
    return Promise.reject(
      new DatabaseError(tagError.name, tagError.message, 'Wait')
    );
  }

  const urlList = [...otherPages];

  urlList.push(
    ...comics
      .map((comic) => {
        const comicSlug = `${SEO.URL}/comic/${comic.slug}`;

        const issues = comic.issues as IIssueDocument[];
        const issueSlugs = issues.map(
          (issue) => `${SEO.URL}/comic/${comic.slug}/${issue.slug}`
        );

        return [comicSlug, issueSlugs].flat();
      })
      .flat()
  );

  urlList.push(...tags.map((tag) => `${SEO.URL}/tag/${tag.slug}`));

  const generatedSitemaps = [];
  const chunkSize = 45000;
  let chunkIndex = 0;
  for (let i = 0; i < urlList.length; i += chunkSize) {
    const chunk = urlList.slice(i, i + chunkSize);
    const content = generateChunkContent(chunk);

    const filename = `sitemap-${chunkIndex}.xml`;
    const savePath = path.resolve(process.cwd(), 'public', 'sitemap', filename);
    const [error] = await handle(writeToFile(savePath, content));
    if (error) return Promise.reject(error);

    generatedSitemaps.push(`${SEO.URL}/${filename}`);
    chunkIndex++;
  }

  const sitemapIndexContent = generateSitemapIndex(generatedSitemaps);

  const filename = `sitemap.xml`;
  const savePath = path.resolve(process.cwd(), 'public', 'sitemap', filename);
  const [error] = await handle(writeToFile(savePath, sitemapIndexContent));
  if (error) return Promise.reject(error);

  generatedSitemaps.push(`${SEO.URL}/${filename}`);

  return Promise.resolve(generatedSitemaps);
};

const generateChunkContent = (data: string[]) => {
  const urlList = data
    .map((url) => `\t<url><loc>${url}</loc></url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlList}
</urlset>`;
};

const generateSitemapIndex = (data: string[]) => {
  const indexList = data
    .map(
      (index) =>
        `\t<sitemap>
\t\t<loc>${index}</loc>
\t</sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexList}
</sitemapindex>`;
};

export { getSitemap };
