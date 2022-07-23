import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Container } from '~/components/Container';
import { MiniTagList } from '~/components/MiniTagList';
import { getAllTags } from '~/lib/database';
import { ITagDocument } from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';
import { handle } from '~/lib/utils/promise';

interface IGenresPageProps {
  tags: ITagDocument[];
}

const GenresPage: NextPage<IGenresPageProps> = ({ tags }: IGenresPageProps) => {
  return (
    <>
      <NextSeo
        title="Genres"
        description={`Most popular genres in comic history. Search in our extensive comic genres find your comics with ease. We have over ${tags.length} comic genres available.`}
      />
      <Container>
        <h1 className="block mb-2 text-lg font-medium text-center text-white">
          Most Popular Genres
        </h1>
        <MiniTagList tags={tags} />
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<IGenresPageProps> = async () => {
  const [error, tags] = await handle(
    callDb(getAllTags(-1, 0, 'slug name'), true)
  );
  if (error) {
    throw error;
  }

  return {
    props: {
      tags,
    },
  };
};

export default GenresPage;
