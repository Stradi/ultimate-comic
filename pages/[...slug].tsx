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
import {
  getAllStaticPages,
  getStaticPageBySlug,
  moveImagesToPublicFolder,
} from '~/lib/utils/blog';
import { toHumanReadable } from '~/lib/utils/date';
import { handle } from '~/lib/utils/promise';

interface ICatchAllIndexPageProps {
  post: StaticPage;
}

const CatchAllIndexPage: NextPage<ICatchAllIndexPageProps> = ({
  post,
}: ICatchAllIndexPageProps) => {
  return (
    <Container>
      <NextSeo title={post.title} />
      <h1 className="text-center text-3xl font-black text-white">
        {post.title}
      </h1>
      <br></br>
      <div className="text-center">
        <p>
          <span className="font-medium">Last updated</span>:{' '}
          {toHumanReadable(post.updatedAt)}
        </p>
      </div>
      <br></br>
      <div className="prose prose-invert mx-auto prose-a:text-inherit prose-a:transition prose-a:duration-100 hover:prose-a:text-red-600 prose-blockquote:border-l-red-600 prose-li:marker:font-bold prose-li:marker:text-red-600">
        <MDXRemote {...post.content} />
      </div>
    </Container>
  );
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  slug: string[];
}

export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  const [error, staticPages] = await handle(getAllStaticPages());
  if (error) return { paths: [], fallback: 'blocking' };

  const paths = staticPages.map((staticPage) => {
    return {
      params: { slug: [staticPage.slug] },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  ICatchAllIndexPageProps,
  IStaticPathsQuery
> = async (context: GetStaticPropsContext<IStaticPathsQuery>) => {
  const pageSlug = (context.params as IStaticPathsQuery).slug[0];
  const [error, post] = await handle(getStaticPageBySlug(pageSlug));

  if (error) {
    return {
      notFound: true,
    };
  }

  moveImagesToPublicFolder(pageSlug, 'staticpage');

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};

export default CatchAllIndexPage;
