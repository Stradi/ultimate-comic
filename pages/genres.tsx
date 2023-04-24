import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { CardList } from '~/components/CardList';
import { Container } from '~/components/Container';
import { Section } from '~/components/Section';
import { runSQL } from '~/lib/database';
import { IComic, ITag } from '~/lib/database/models';

interface IGenresPageProps {
  tags: (ITag & {
    comicCount: number;
  })[];
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
            items={tags.map((tag) => ({
              href: `/tag/${tag.slug}`,
              title: tag.name,
              subtitle: `${tag.comicCount} Comics`,
              image: '',
              mini: true,
            }))}
            responsive={false}
          />
        </Section>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<IGenresPageProps> = async () => {
  const tags = await _getAllTags();

  return {
    props: {
      tags,
    },
  };
};

const _getAllTags = async () => {
  const result = await runSQL(`
    SELECT
      t.name,
      t.slug,
      COUNT(c.id) AS comic_count
    FROM tag t
    LEFT JOIN comic_tag ct ON t.id = ct.tag_id
    LEFT JOIN comic c ON ct.comic_id = c.id
    GROUP BY t.id
    ORDER BY t.name ASC
  `);

  return result.map(
    (tag) =>
      ({
        name: tag.name,
        slug: tag.slug,
        comics: [] as IComic[],
        comicCount: tag.comic_count,
      } as ITag & { comicCount: number })
  );
};

export default GenresPage;
