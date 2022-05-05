import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Container } from '~/components/Container';
import { getBlogPostBySlug } from '~/lib/utils/blog';
import { handle } from '~/lib/utils/promise';

interface IBlogSlugPageProps {
  post: BlogPost;
}

//TODO: Add remark to parse markdown.
const BlogSlugPage: NextPage<IBlogSlugPageProps> = ({
  post,
}: IBlogSlugPageProps) => {
  return (
    <Container className="prose prose-invert">
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </Container>
  );
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  IBlogSlugPageProps,
  IStaticPathsQuery
> = async (context: GetStaticPropsContext<IStaticPathsQuery>) => {
  const slug = (context.params as IStaticPathsQuery).slug;
  const [error, post] = await handle(getBlogPostBySlug(slug));

  if (error) throw JSON.stringify(error);

  return {
    props: {
      post,
    },
  };
};

export default BlogSlugPage;
