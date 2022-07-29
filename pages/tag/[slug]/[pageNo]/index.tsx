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
        description={`Read the latest and most popular comics about ${tag.name} online for free. Our extensive database includes thousands of comics about ${tag.name}.`}
      />
      <Container>
        <h1 className="mb-2 block rounded-md bg-neutral-900 p-2 text-center text-lg font-medium">
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
        <div className="mt-2 flex justify-center gap-1">
          {pageNo !== 0 ? (
            <>
              <Link href={`/tag/${tag.slug}/${pageNo - 1}`}>
                <a className="rounded-md bg-neutral-900 py-1 px-2 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600">
                  {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                  <i className="ri-arrow-left-s-line ri-fw align-middle" />
                </a>
              </Link>
              <Link href={`/tag/${tag.slug}/${pageNo - 1}`}>
                <a className="rounded-md bg-neutral-900 py-1 px-3 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600">
                  {pageNo - 1}
                </a>
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
              <Link href={`/tag/${tag.slug}/${pageNo + 1}`}>
                <a className="rounded-md bg-neutral-900 py-1 px-3 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600">
                  {pageNo + 1}
                </a>
              </Link>
              <Link href={`/tag/${tag.slug}/${pageNo + 1}`}>
                <a className="rounded-md bg-neutral-900 py-1 px-2 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600">
                  {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                  <i className="ri-arrow-right-s-line ri-fw align-middle" />
                </a>
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
  const tags = (
    await callDb(getAllTags(PAGES.TAG.GENERATE_ON_BUILD, 0, 'slug'))
  ).map((tag) => tag.slug);

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
        'name slug isCompleted',
        PAGES.TAG.COMIC_PER_PAGE,
        pageNo * PAGES.TAG.COMIC_PER_PAGE
      ),
      true
    )
  );

  if (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      tag,
      pageNo,
    },
  };
};

export default TagPage;
