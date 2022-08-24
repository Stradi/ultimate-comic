import { GetServerSideProps, NextPage } from 'next';

const BlogPage: NextPage = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: 'https://blog.ultimatecomic.com',
      permanent: true,
    },
  };
};

export default BlogPage;
