import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getAllComics, getComicBySlug } from '../../lib/database';
import { IComicDocument } from '../../lib/database/models';
import { callDb } from '../../lib/utils/database';

interface IComicSlugPageProps {
  comic: IComicDocument;
}

const ComicSlugPage: NextPage<IComicSlugPageProps> = ({
  comic,
}: IComicSlugPageProps) => {
  return <div>{comic.name}</div>;
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  const slugs = (await callDb(getAllComics(-1, 0, 'slug'))).map(
    (comic) => comic.slug
  );

  const paths = slugs.map((slug) => ({
    params: { slug },
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
  const slug = (context.params as IStaticPathsQuery).slug;
  const comic = await callDb(
    getComicBySlug(slug, undefined, ['authors', 'tags', 'issues']),
    true
  );

  return {
    props: {
      comic,
    },
  };
};

export default ComicSlugPage;
