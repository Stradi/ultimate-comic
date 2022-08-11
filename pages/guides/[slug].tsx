import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';
import { Container } from '~/components/Container';
import { getAllGuides, getGuideBySlug } from '~/lib/utils/blog';
import { handle } from '~/lib/utils/promise';

import MDXComponents from '~/components/MDXComponents';
import { toHumanReadable } from '~/lib/utils/date';
import { CardList } from '~/components/CardList';
import { comicToCardListProp } from '~/components/CardList/CardList.helper';
import { callDb } from '~/lib/utils/database';
import { getComicBySlug } from '~/lib/database';
import { IComicDocument } from '~/lib/database/models';

interface IGuidePageProps {
  guide: GuidePage;
  relatedComics: IComicDocument[];
}

const GuidePage: NextPage<IGuidePageProps> = ({
  guide,
  relatedComics,
}: IGuidePageProps) => {
  return (
    <div className="flex">
      <Container>
        <NextSeo
          title={`${guide.title} Guide`}
          description={guide.seo.description}
        />
        <h1 className="text-center text-5xl font-bold text-white">
          {guide.title} Guide
        </h1>
        <br></br>
        <div className="flex flex-col text-center text-sm">
          <p>
            <span className="text-neutral-400">By </span>
            <span className="font-medium text-neutral-100">
              UltimateComic staff
            </span>
          </p>
          <p>
            Published at{' '}
            <span className="font-medium text-neutral-100">
              {toHumanReadable(guide.publishedAt)}
            </span>
            , last updated at{' '}
            <span className="font-medium text-neutral-100">
              {toHumanReadable(guide.updatedAt)}
            </span>
          </p>
        </div>
        <br></br>
        <div className="prose-lg prose prose-invert mx-auto prose-h1:mb-2 prose-a:text-inherit prose-a:transition prose-a:duration-100 hover:prose-a:text-red-600 prose-blockquote:border-l-red-600 prose-li:marker:font-bold prose-li:marker:text-red-600">
          <p>{guide.excerpt}</p>
          <MDXRemote {...guide.content} components={MDXComponents} />
        </div>
      </Container>
      <aside className="sticky inset-y-0 mx-4 hidden h-full rounded-lg bg-neutral-900 p-4 sm:block">
        <div>
          <h2 className="mb-4 text-2xl font-medium text-white">
            Related Comics
          </h2>
          <div className="h-screen overflow-y-auto py-0.5">
            <CardList
              items={relatedComics.map((relatedComic) =>
                comicToCardListProp(relatedComic)
              )}
              responsive={false}
              singleColumn={true}
            />
          </div>
        </div>
      </aside>
    </div>
  );
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  const [error, guides] = await handle(getAllGuides());
  if (error) return { paths: [], fallback: 'blocking' };

  const paths = guides.map((guide) => ({
    params: { slug: guide.slug },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  IGuidePageProps,
  IStaticPathsQuery
> = async (context: GetStaticPropsContext<IStaticPathsQuery>) => {
  const slug = (context.params as IStaticPathsQuery).slug;
  const [error, guide] = await handle(getGuideBySlug(slug));

  if (error) {
    return {
      notFound: true,
      revalidate: 120,
    };
  }

  const relatedComics = [];
  for (const relatedComic of guide.relatedComics) {
    const [error, comic] = await callDb(
      handle(getComicBySlug(relatedComic, 'name slug coverImage issues')),
      true
    );

    if (!error && comic !== null) {
      relatedComics.push(comic as IComicDocument);
    }
  }

  return {
    props: {
      guide: JSON.parse(JSON.stringify(guide)),
      relatedComics,
    },
  };
};

export default GuidePage;
