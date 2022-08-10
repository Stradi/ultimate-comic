import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { CardList } from '~/components/CardList';
import { tagToCardListProps } from '~/components/CardList/CardList.helper';
import { Container } from '~/components/Container';
import { getAllTags } from '~/lib/database';
import { ITagDocument } from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';

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
        <h1 className="mb-2 block text-center text-lg font-medium text-white">
          Most Popular Genres
        </h1>
        <CardList
          items={tags.map((tag) => tagToCardListProps(tag))}
          responsive={false}
        />
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<IGenresPageProps> = async () => {
  const tags = await callDb(getAllTags(-1, 0, 'slug name'), true);

  return {
    props: {
      tags,
    },
  };
};

export default GenresPage;
