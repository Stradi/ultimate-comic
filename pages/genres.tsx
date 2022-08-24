import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { CardList } from '~/components/CardList';
import { tagToCardListProps } from '~/components/CardList/CardList.helper';
import { Container } from '~/components/Container';
import { Section } from '~/components/Section';
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
        description={`All genres available in UltimateComic website. With more than ${tags.length} genres you can easily find any comic you want.`}
      />
      <Container>
        <Section
          title="All Genres"
          subtitle="List of all genres from UltimateComic"
          showSeeAllButton={false}
        >
          <CardList
            items={tags.map((tag) => tagToCardListProps(tag))}
            responsive={false}
          />
        </Section>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<IGenresPageProps> = async () => {
  const tags = await callDb(getAllTags(-1, 0, 'slug name comics'), true);

  return {
    props: {
      tags,
    },
    revalidate: 60,
  };
};

export default GenresPage;
