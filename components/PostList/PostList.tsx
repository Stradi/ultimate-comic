import { SinglePost } from './SinglePost';

interface IPostListProps {
  posts: BlogPost[];
}

const PostList = ({ posts }: IPostListProps) => {
  const postsDOM = posts.map((post) => (
    <SinglePost post={post} key={post.slug} />
  ));

  return <div>{postsDOM}</div>;
};

export { PostList };
