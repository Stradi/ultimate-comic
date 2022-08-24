import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { CardList } from '~/components/CardList';
import { comicToCardListProp } from '~/components/CardList/CardList.helper';
import { Container } from '~/components/Container';
import { Section } from '~/components/Section';
import { getAllComics } from '~/lib/database';
import { IComicDocument } from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';

interface IPopularComicsPageProps {
  comics: IComicDocument[];
}

const PopularComicsPage: NextPage<IPopularComicsPageProps> = ({
  comics,
}: IPopularComicsPageProps) => {
  return (
    <>
      <NextSeo
        title="Popular Comics"
        description="Most popular comics in our extensive comic database. See which comic have most views and read it for free. Read Marvel, DC Comics, Valiant Comics and more."
      />
      <Container>
        <Section
          title="Popular Comics"
          subtitle={`Most read ${comics.length} comics from UltimateComic`}
          showSeeAllButton={false}
        >
          <CardList
            items={comics.map((comic) => comicToCardListProp(comic))}
            responsive={false}
          />
        </Section>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<
  IPopularComicsPageProps
> = async () => {
  const popularComics = await callDb(
    getAllComics(
      100,
      0,
      'name slug coverImage viewCount issues',
      [],
      {
        coverImage: {
          $ne: null,
        },
      },
      { viewCount: 'descending' }
    ),
    true
  );

  return {
    props: {
      comics: popularComics,
    },
    revalidate: 60,
  };
};

export default PopularComicsPage;
