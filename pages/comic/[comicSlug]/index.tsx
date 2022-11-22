import { IMAGE, PAGES } from 'configs/ui';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { ParsedUrlQuery } from 'querystring';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { IssueList } from '~/components/IssueList';
import { ComicSeriesJsonLd } from '~/components/SEO/ComicSeriesJsonLd';
import { runSQL } from '~/lib/database';
import { IComic, IIssue, ITag } from '~/lib/database/models';
import { resizeImage } from '~/lib/utils/image';

interface IGroupedIssues {
  [key: string]: IIssue[];
}

interface IComicSlugPageProps {
  comic: IComic;
  groupedIssues: IGroupedIssues;
}

const ComicSlugPage: NextPage<IComicSlugPageProps> = ({
  comic,
  groupedIssues,
}: IComicSlugPageProps) => {
  const releaseDate = new Date(
    Date.parse((comic.releaseDate as Date).toString())
  );
  const authors = comic.authors?.map((author) => author?.name) as string[];
  const issues = comic.issues as IIssue[];

  const tagsDOM = (comic.tags as ITag[]).map((tag) => (
    <Button
      href={`/tag/${tag.slug}`}
      text={tag.name}
      type="minimal"
      key={tag.slug}
    />
  ));

  return (
    <>
      <NextSeo
        title={comic.name}
        description={comic.summary as string}
        openGraph={{
          images: [
            {
              url:
                comic.coverImage ||
                'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNU/Q8AAU8BJijqIsEAAAAASUVORK5CYII=',
              alt: `Cover image of ${comic.name} comic.`,
            },
          ],
        }}
      />
      <ComicSeriesJsonLd
        name={comic.name}
        description={comic.summary as string}
        startDate={releaseDate.getFullYear()}
      />
      <Container>
        <div className="md:flex">
          <div className="mx-auto w-10/12 sm:w-3/5 md:w-2/5 lg:w-1/3">
            <Image
              src={
                comic.coverImage ||
                'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNU/Q8AAU8BJijqIsEAAAAASUVORK5CYII='
              }
              layout="responsive"
              width={1}
              height={1.35}
              alt={`${comic.name} cover image`}
              className="rounded-md"
              priority
              sizes={'(max-width: 640px) 100vw, 33vw'}
              unoptimized={true}
            />
          </div>
          <div className="m-auto w-full rounded-md bg-neutral-900 p-4 sm:w-10/12 md:w-3/5 md:rounded-r-md md:rounded-l-none lg:w-2/3">
            <h1 className="mb-2 text-left text-2xl font-medium text-white">
              {comic.name}
            </h1>
            <div className="my-4">{tagsDOM}</div>
            <p className="my-2 font-medium text-white">Summary:</p>
            <p className="text-sm">{comic.summary}</p>
            <div className="my-2 grid grid-cols-3">
              <div>
                <span className="font-medium text-white">Authors:</span>
                <br></br>
                <span className="text-sm">{authors}</span>
              </div>
              <div>
                <span className="font-medium text-white">Status:</span>{' '}
                <br></br>
                <span className="text-sm">
                  {comic.isCompleted ? 'Completed' : 'Ongoing'}
                </span>
              </div>
              <div>
                <span className="font-medium text-white">Release Year:</span>{' '}
                <br></br>
                <span className="text-sm">{releaseDate.getFullYear()}</span>
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <Button
                href={`/comic/${comic.slug}/${issues[issues.length - 1].slug}`}
                text="Read First Issue"
                type="minimal"
              />
              <Button
                href={`/comic/${comic.slug}/${issues[0].slug}`}
                text="Read Latest Issue"
                type="default"
              />
            </div>
          </div>
        </div>
        <IssueList issues={groupedIssues} slug={comic.slug} />
      </Container>
    </>
  );
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  comicSlug: string;
}

export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  const slugs = await _getComicSlugs(PAGES.COMIC.GENERATE_ON_BUILD);
  const paths = slugs.map((slug) => ({
    params: { comicSlug: slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  IComicSlugPageProps,
  IStaticPathsQuery
> = async (context: GetStaticPropsContext<IStaticPathsQuery>) => {
  const slug = (context.params as IStaticPathsQuery).comicSlug;
  const comic = await _getComic(slug);

  if (!comic) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      comic: JSON.parse(JSON.stringify(comic)),
      groupedIssues: _groupIssues(comic.issues as IIssue[]),
    },
  };
};

const _groupIssues = (arr: IIssue[]): IGroupedIssues => {
  return arr.reduce((acc: { [key: string]: IIssue[] }, issue: IIssue) => {
    const postfix = issue.name.substring('Issue #'.length).split(' ')[0];
    const isNumber = !isNaN(Number(postfix));

    const key = isNumber ? 'Default' : postfix;

    const keyStore = acc[key] || (acc[key] = []);
    keyStore.push(issue);

    return acc;
  }, {});
};

const _getComicSlugs = async (count: number) => {
  const result = await runSQL(`
    SELECT
      c.slug as comic_slug
    FROM comic c
    LIMIT ${count}
  `);

  return result.map((row) => row.comic_slug);
};

const _getComic = async (slug: string) => {
  const result = await runSQL(`
    SELECT
      c.name as comic_name,
      c.slug as comic_slug,
      c.is_completed as comic_is_completed,
      c.release_date as comic_release_date,
      c.cover_image as comic_cover_image,
      GROUP_CONCAT(t.name) as tag_names,
      GROUP_CONCAT(t.slug) as tag_slugs,
      GROUP_CONCAT(a.name) as author_names,
      GROUP_CONCAT(a.slug) as author_slugs,
      i.name as issue_name,
      i.slug as issue_slug,
      p.url as page_url
    FROM comic c
    JOIN comic_author ca ON ca.comic_id = c.id
    JOIN comic_tag ct ON ct.comic_id = c.id
    JOIN author a ON a.id = ca.author_id
    JOIN tag t ON t.id = ct.tag_id
    JOIN issue i ON i.comic_id = c.id
    JOIN page p ON p.id = (SELECT pp.id FROM page pp WHERE pp.issue_id = i.id LIMIT 1)
    WHERE c.slug = '${slug}'
    GROUP BY c.id, i.name, i.slug, p.url, i.id
    ORDER BY i.id;
  `);

  if (!result[0]) {
    return null;
  }

  return {
    name: result[0].comic_name,
    slug: result[0].comic_slug,
    isCompleted: result[0].comic_is_completed,
    releaseDate: result[0].comic_release_date,
    coverImage: resizeImage(result[0].comic_cover_image, IMAGE.SIZES.MEDIUM),
    summary: result[0].comic_summary,
    authors: result[0].author_names
      .split(',')
      .map((name: string, index: number) => ({
        name,
        slug: result[0].author_slugs.split(',')[index],
      })),
    tags: result[0].tag_names.split(',').map((name: string, index: number) => ({
      name,
      slug: result[0].tag_slugs.split(',')[index],
    })),
    issues: result
      .map((row) => ({
        name: row.issue_name,
        slug: row.issue_slug,
        images: [resizeImage(row.page_url, IMAGE.SIZES.SMALL)],
      }))
      .reverse(),
  } as IComic;
};

export default ComicSlugPage;
