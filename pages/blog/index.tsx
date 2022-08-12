import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { CardList } from '~/components/CardList';
import { postToCardListProps } from '~/components/CardList/CardList.helper';
import { Container } from '~/components/Container';
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
      <h1 className="mb-2 block text-center text-lg font-medium text-white">
        All Articles
      </h1>
      {posts.length > 0 ? (
        <div>
          <CardList items={posts.map((post) => postToCardListProps(post))} />
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xl font-medium">There are no articles yet.</p>
        </div>
      )}
    </Container>
  );
};

export const getStaticProps: GetStaticProps<IBlogListPageProps> = async () => {
  const [, allPosts] = await handle(getAllPosts());

  return {
    props: {
      posts: allPosts ? JSON.parse(JSON.stringify(allPosts)) : [],
    },
  };
};

export default BlogListPage;
