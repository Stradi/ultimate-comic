import { PAGES } from 'configs/ui';
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
import { Container } from '~/components/Container';
import { MiniComicList } from '~/components/MiniComicList';
import { getAllTags, getTagBySlug } from '~/lib/database';
import { IComicDocument, ITagDocument } from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';
import { handle } from '~/lib/utils/promise';

interface ITagPageProps {
  tag: ITagDocument;
  pageNo: number;
}

const TagPage: NextPage<ITagPageProps> = ({ tag, pageNo }: ITagPageProps) => {
  const comics = tag.comics as IComicDocument[];
  return (
    <>
      <NextSeo
        title={`${tag.name}`}
        description={`Read the latest and most popular comics about ${tag.name} online for free.`}
      />
      <Container>
        <h1 className="block p-2 mb-2 text-lg font-medium text-center bg-neutral-900 rounded-md">
          Comics about <span className="text-white">{tag.name}</span>
        </h1>
        {comics.length > 0 ? (
          <MiniComicList comics={comics} />
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
        <div className="flex gap-1 justify-center mt-2">
          {pageNo !== 0 ? (
            <>
              <Link href={`/tag/${tag.slug}/${pageNo - 1}`}>
                <a className="py-1 px-2 bg-neutral-900 hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100">
                  {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                  <i className="align-middle ri-arrow-left-s-line ri-fw" />
                </a>
              </Link>
              <Link href={`/tag/${tag.slug}/${pageNo - 1}`}>
                <a className="py-1 px-3 bg-neutral-900 hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100">
                  {pageNo - 1}
                </a>
              </Link>
            </>
          ) : (
            <>
              <div className="py-1 px-3 bg-black/50 rounded-md hover:cursor-not-allowed">
                -
              </div>
              <div className="py-1 px-3 bg-black/50 rounded-md hover:cursor-not-allowed">
                -
              </div>
            </>
          )}
          <div className="py-1 px-3 bg-neutral-800 rounded-md">{pageNo}</div>
          {comics.length == PAGES.ALL_COMICS.COMIC_PER_PAGE ? (
            <>
              <Link href={`/tag/${tag.slug}/${pageNo + 1}`}>
                <a className="py-1 px-3 bg-neutral-900 hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100">
                  {pageNo + 1}
                </a>
              </Link>
              <Link href={`/tag/${tag.slug}/${pageNo + 1}`}>
                <a className="py-1 px-2 bg-neutral-900 hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100">
                  {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                  <i className="align-middle ri-arrow-right-s-line ri-fw" />
                </a>
              </Link>
            </>
          ) : (
            <>
              <div className="py-1 px-3 bg-black/50 rounded-md hover:cursor-not-allowed">
                -
              </div>
              <div className="py-1 px-3 bg-black/50 rounded-md hover:cursor-not-allowed">
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
  const tags = (await callDb(getAllTags(5, 0, 'slug'))).map((tag) => tag.slug);

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

  const [error, tag] = await handle(
    callDb(
      getTagBySlug(
        slug,
        'name slug comics',
        [
          {
            fieldName: 'comics',
            fields: 'name slug isCompleted',
          },
        ],
        PAGES.TAG.COMIC_PER_PAGE,
        pageNo * PAGES.TAG.COMIC_PER_PAGE
      ),
      true
    )
  );

  if (error) {
    throw error;
  }

  return {
    props: {
      tag,
      pageNo,
    },
  };
};

export default TagPage;
