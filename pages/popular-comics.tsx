import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { CardList } from '~/components/CardList';
import { comicToCardListProp } from '~/components/CardList/CardList.helper';
import { Container } from '~/components/Container';
import { Section } from '~/components/Section';
import { runSQL } from '~/lib/database';
import { IComic } from '~/lib/database/models';

interface IPopularComicsPageProps {
  comics: IComic[];
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
  const popularComics = await _getPopularComics(100);

  return {
    props: {
      comics: popularComics,
    },
    revalidate: 60,
  };
};

const _getPopularComics = async (count: number) => {
  const result = await runSQL(`
    SELECT
      c.name as comic_name,
      c.slug as comic_slug,
      c.cover_image as comic_cover_image,
      i.issue_count as comic_issue_count
    FROM comic c
    JOIN (
      SELECT comic_id, COUNT(*) as issue_count FROM issue GROUP BY comic_id
    ) i ON i.comic_id = c.id
    /* ORDER BY c.view_count DESC */
    LIMIT ${count};
  `);

  return result.map(
    (row) =>
      ({
        name: row.comic_name,
        slug: row.comic_slug,
        coverImage: row.comic_cover_image,
        issues: new Array(row.comic_issue_count).fill(null),
      } as IComic)
  );
};

export default PopularComicsPage;
