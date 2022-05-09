import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Container } from '~/components/Container';
import { getAllStaticPages, getStaticPageBySlug } from '~/lib/utils/blog';
import { handle } from '~/lib/utils/promise';

interface ICatchAllIndexPageProps {
  post: StaticPage;
}

const CatchAllIndexPage: NextPage<ICatchAllIndexPageProps> = ({
  post,
}: ICatchAllIndexPageProps) => {
  return (
    <Container>
      <h1 className="text-3xl font-black text-center text-white">
        {post.title}
      </h1>
      <br></br>
      <div
        className="mx-auto prose-li:marker:font-bold prose-a:text-inherit prose-li:marker:text-red-600 hover:prose-a:text-red-600 prose-blockquote:border-l-red-600 prose-a:transition prose-a:duration-100 prose prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>
    </Container>
  );
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  slug: string[];
}

export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  const [error, staticPages] = await handle(getAllStaticPages());
  if (error) throw error;

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

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};

export default CatchAllIndexPage;
