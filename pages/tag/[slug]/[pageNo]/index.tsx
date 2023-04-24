import { IMAGE, PAGES } from 'configs/ui';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { Button } from '~/components/Button';
import { CardList } from '~/components/CardList';
import { comicToCardListProp } from '~/components/CardList/CardList.helper';
import { Container } from '~/components/Container';
import { runSQL } from '~/lib/database';
import { IComic, ITag } from '~/lib/database/models';
import { resizeImage } from '~/lib/utils/image';

interface ITagPageProps {
  tag: ITag;
  pageNo: number;
}

const TagPage: NextPage<ITagPageProps> = ({ tag, pageNo }: ITagPageProps) => {
  const comics = tag.comics as IComic[];
  return (
    <>
      <NextSeo
        title={`${tag.name}`}
        description={`Read the latest and most popular comics about ${tag.name} online for free. Our extensive database includes thousands of comics about ${tag.name}.`}
      />
      <Container>
        <h1 className="mb-2 block rounded-md bg-neutral-900 p-2 text-center text-lg font-medium">
          Comics about <span className="text-white">{tag.name}</span>
        </h1>
        {comics.length > 0 ? (
          <CardList
            items={comics.map((comic) => comicToCardListProp(comic, false))}
            responsive={false}
          />
        ) : (
          <div className="text-center">
            <p className="mb-4 text-xl font-medium">No comics found</p>
            <Button
              href="/all-comics/0"
              text="Go to All Comics"
              type="default"
            />{' '}
          </div>
        )}
        <div className="mt-2 flex justify-center gap-1">
          {pageNo !== 0 ? (
            <>
              <Link
                href={`/tag/${tag.slug}/${pageNo - 1}`}
                prefetch={false}
                className="rounded-md bg-neutral-900 py-1 px-2 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                <i className="ri-arrow-left-s-line ri-fw align-middle" />
              </Link>
              <Link
                href={`/tag/${tag.slug}/${pageNo - 1}`}
                prefetch={false}
                className="rounded-md bg-neutral-900 py-1 px-3 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {pageNo - 1}
              </Link>
            </>
          ) : (
            <>
              <div className="rounded-md bg-black/50 py-1 px-3 hover:cursor-not-allowed">
                -
              </div>
              <div className="rounded-md bg-black/50 py-1 px-3 hover:cursor-not-allowed">
                -
              </div>
            </>
          )}
          <div className="rounded-md bg-neutral-800 py-1 px-3">{pageNo}</div>
          {comics.length == PAGES.TAG.COMIC_PER_PAGE ? (
            <>
              <Link
                href={`/tag/${tag.slug}/${pageNo + 1}`}
                prefetch={false}
                className="rounded-md bg-neutral-900 py-1 px-3 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {pageNo + 1}
              </Link>
              <Link
                href={`/tag/${tag.slug}/${pageNo + 1}`}
                prefetch={false}
                className="rounded-md bg-neutral-900 py-1 px-2 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                <i className="ri-arrow-right-s-line ri-fw align-middle" />
              </Link>
            </>
          ) : (
            <>
              <div className="rounded-md bg-black/50 py-1 px-3 hover:cursor-not-allowed">
                -
              </div>
              <div className="rounded-md bg-black/50 py-1 px-3 hover:cursor-not-allowed">
                -
              </div>
            </>
          )}
        </div>
      </Container>
    </>
  );
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  slug: string;
  pageNo: string;
}

export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  const tags = await _getTagSlugs(PAGES.TAG.GENERATE_ON_BUILD);

  const paths = tags.map((slug) => ({
    params: { slug, pageNo: '0' },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  ITagPageProps,
  IStaticPathsQuery
> = async (context: GetStaticPropsContext<IStaticPathsQuery>) => {
  const params = context.params as IStaticPathsQuery;
  const slug = params.slug;
  const pageNo = Number.parseInt(params.pageNo);

  const tag = await _getTags(slug, pageNo, PAGES.TAG.COMIC_PER_PAGE);

  return {
    props: {
      tag,
      pageNo,
    },
  };
};

const _getTagSlugs = async (count: number) => {
  const result = await runSQL(`
    SELECT
      t.slug as tag_slug
    FROM tag t
    LIMIT ${count};
  `);

  return result.map((row) => row.tag_slug);
};

const _getTags = async (slug: string, pageNo: number, pageLength: number) => {
  const result = await runSQL(`
    SELECT
      t.name as tag_name,
      t.slug as tag_slug,
      c.name as comic_name,
      c.slug as comic_slug,
      c.cover_image as comic_cover_image,
      i.issue_count as comic_issue_count
    FROM tag t
    JOIN comic_tag ct ON ct.tag_id = t.id
    JOIN comic c ON c.id = ct.comic_id
    JOIN (
      SELECT comic_id, COUNT(*) as issue_count FROM issue GROUP BY comic_id
    ) i ON i.comic_id = c.id
    WHERE t.slug = '${slug}'
    LIMIT ${pageNo * pageLength}, ${pageLength};
  `);

  return {
    name: result[0].tag_name,
    slug: result[0].tag_slug,
    comics: result.map((row) => ({
      name: row.comic_name,
      slug: row.comic_slug,
      coverImage: resizeImage(row.comic_cover_image, IMAGE.SIZES.SMALL),
      issues: new Array(row.comic_issue_count).fill(null),
    })),
  } as ITag;
};

export default TagPage;
