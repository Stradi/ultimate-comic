import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Container } from '~/components/Container';
import { PostList } from '~/components/PostList';
import { getAllPosts } from '~/lib/utils/blog';
import { handle } from '~/lib/utils/promise';

interface IBlogListPageProps {
  posts: BlogPost[];
}

const BlogListPage: NextPage<IBlogListPageProps> = ({
  posts,
}: IBlogListPageProps) => {
  return (
    <Container>
      <NextSeo
        title="Articles"
        description="Latest news and articles from comic world."
      />
      <h1 className="block mb-2 text-lg font-medium text-center text-white">
        All Articles
      </h1>
      <PostList posts={posts} />
    </Container>
  );
};

export const getStaticProps: GetStaticProps<IBlogListPageProps> = async () => {
  const [error, allPosts] = await handle(getAllPosts());
  if (error) throw JSON.stringify(error);

  const posts = JSON.parse(JSON.stringify(allPosts));
  return {
    props: {
      posts,
    },
  };
};

export default BlogListPage;
