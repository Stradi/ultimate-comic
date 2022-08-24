import { GetStaticProps, NextPage } from 'next';

const BlogPage: NextPage = () => {
  return <></>;
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    redirect: {
      destination: 'https://blog.ultimatecomic.com',
      permanent: true,
    },
  };
};

export default BlogPage;
