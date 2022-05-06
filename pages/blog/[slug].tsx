import { SEO } from 'configs/seo';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { ArticleJsonLd, NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';
import { Container } from '~/components/Container';
import { getBlogPostBySlug } from '~/lib/utils/blog';
import { handle } from '~/lib/utils/promise';

interface IBlogSlugPageProps {
  post: BlogPost;
}

//TODO: Add remark-directive for adding custom classnames and
//other directives in Markdown.
const BlogSlugPage: NextPage<IBlogSlugPageProps> = ({
  post,
}: IBlogSlugPageProps) => {
  return (
    <Container>
      <NextSeo title={post.title} description={post.seo.description} />
      <ArticleJsonLd
        authorName={SEO.WEBSITE_NAME}
        datePublished={post.publishedAt.toString()}
        description={post.seo.description}
        title={post.title}
        url={`${SEO.URL}/blog/${post.slug}`}
        images={[]}
      />
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
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};

export default BlogSlugPage;
