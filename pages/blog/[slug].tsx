import { SEO } from 'configs/seo';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { ArticleJsonLd, NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';
import { Container } from '~/components/Container';
import { getAllPosts, getBlogPostBySlug } from '~/lib/utils/blog';
import { handle } from '~/lib/utils/promise';

import MDXComponents from '~/components/MDXComponents';
import { toHumanReadable } from '~/lib/utils/date';

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
      <h1 className="text-center text-5xl font-bold text-white">
        {post.title}
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
            {toHumanReadable(post.publishedAt)}
          </span>
          , last updated at{' '}
          <span className="font-medium text-neutral-100">
            {toHumanReadable(post.updatedAt)}
          </span>
        </p>
      </div>
      <br></br>
      <div className="prose-lg prose prose-invert mx-auto max-w-3xl prose-h1:mb-2 prose-a:text-inherit prose-a:transition prose-a:duration-100 hover:prose-a:text-red-600 prose-blockquote:border-l-red-600 prose-li:marker:font-bold prose-li:marker:text-red-600 prose-img:my-0 prose-img:p-2">
        <MDXRemote {...post.content} components={MDXComponents} />
      </div>
    </Container>
  );
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  const [error, posts] = await handle(getAllPosts());
  if (error) return { paths: [], fallback: 'blocking' };

  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  IBlogSlugPageProps,
  IStaticPathsQuery
> = async (context: GetStaticPropsContext<IStaticPathsQuery>) => {
  const slug = (context.params as IStaticPathsQuery).slug;
  const [error, post] = await handle(getBlogPostBySlug(slug));

  if (error) {
    return {
      notFound: true,
      revalidate: 120,
    };
  }

  return {
    props: {
      post: JSON.parse(JSON.stringify(post)),
    },
  };
};

export default BlogSlugPage;
