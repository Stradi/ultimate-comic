import type { GetStaticProps, NextPage } from 'next';
import { CardList } from '~/components/CardList';
import {
  comicToCardListProp,
  issueToCardListProp,
} from '~/components/CardList/CardList.helper';
import { Container } from '~/components/Container';
import { MyCarousel } from '~/components/MyCarousel';
import {
  comicToMyCarouselProp,
  guideToMyCarouselProp,
} from '~/components/MyCarousel/MyCarousel.helper';
import { Section } from '~/components/Section';
import { runSQL } from '~/lib/database';
import { IComic, IIssue } from '~/lib/database/models';
import { getAllGuides } from '~/lib/utils/blog';

interface IHomePageProps {
  newIssues: IIssue[];
  popularComics: IComic[];
  randomComics: IComic[];
  guides: GuidePage[];
}

const Home: NextPage<IHomePageProps> = ({
  newIssues,
  popularComics,
  randomComics,
  guides,
}: IHomePageProps) => {
  return (
    <Container>
      <MyCarousel
        items={[...popularComics.map((comic) => comicToMyCarouselProp(comic))]}
      />
      <Section
        title="Latest Issues"
        subtitle="Issues fresh out of oven"
        showSeeAllButton={false}
        // seeAllButtonHref="/latest-issues"
      >
        <CardList
          items={newIssues.map((issue) => issueToCardListProp(issue))}
        />
      </Section>
      <Section
        title="Popular Comics"
        subtitle="Most read comics in UltimateComic"
        showSeeAllButton={true}
        seeAllButtonHref="/popular-comics"
      >
        <CardList
          items={popularComics.map((comic) => comicToCardListProp(comic))}
        />
      </Section>
      <Section
        title="Can't Decide?"
        subtitle="Here are some random comics for you"
        showSeeAllButton={false}
      >
        <CardList
          items={randomComics.map((comic) => comicToCardListProp(comic))}
        />
      </Section>
      <Section
        title="Still Can't Decide?"
        subtitle="We got you. We also prepared some detailed guides for you"
        showSeeAllButton={true}
        seeAllButtonHref="/guides"
      >
        <MyCarousel
          items={[...guides.map((guide) => guideToMyCarouselProp(guide))]}
        />
      </Section>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<IHomePageProps> = async () => {
  const newIssues = await _getLatestIssues(10);
  const popularComics = await _getPopularComics(10);
  const randomComics = await _getRandomComics(5);
  const guides = await getAllGuides();

  return {
    props: {
      newIssues: JSON.parse(JSON.stringify(newIssues)),
      popularComics: popularComics,
      randomComics: JSON.parse(JSON.stringify(randomComics)),
      guides: guides ? JSON.parse(JSON.stringify(guides.slice(0, 3))) : [],
    },
    // Currently Netlify doesn't support On-demand revalidation,
    // so /api/revalidate route doesn't work. Instead we can use ISR.
    // TODO: Remove this when @netlify/plugin-nextjs supports on-demand
    // revalidation.
    revalidate: 60,
  };
};

const _getLatestIssues = async (count = 10): Promise<Partial<IIssue[]>> => {
  const result = await runSQL(`
    SELECT
      i.id as issue_id,
      i.created_at as issue_created_at,
      i.name as issue_name,
      i.slug as issue_slug,
      c.name as comic_name,
      c.slug as comic_slug,
      p.url as page_url
    FROM issue i
    JOIN comic c ON c.id = i.comic_id
    JOIN page p ON p.id = (SELECT pp.id FROM page pp WHERE pp.issue_id = i.id LIMIT 1)
    ORDER BY i.created_at DESC
    LIMIT ${count};
  `);

  return result.map(
    (issue) =>
      ({
        id: issue.issue_id,
        createdAt: issue.issue_created_at,
        name: issue.issue_name,
        slug: issue.issue_slug,
        comic: {
          name: issue.comic_name,
          slug: issue.comic_slug,
        },
        images: [issue.page_url],
      } as IIssue)
  );
};

const _getPopularComics = async (count: number) => {
  const result = await runSQL(`
    SELECT
      c.name as comic_name,
      c.slug as comic_slug,
      c.cover_image as comic_cover_image,
      i.issue_count as comic_issue_count,
      GROUP_CONCAT(t.name) as tag_names,
      GROUP_CONCAT(t.slug) as tag_slugs
    FROM comic c
    JOIN comic_tag ct ON ct.comic_id = c.id
    JOIN tag t ON t.id = ct.tag_id
    JOIN (
      SELECT comic_id, COUNT(*) as issue_count FROM issue GROUP BY comic_id
    ) i ON i.comic_id = c.id
    GROUP BY c.id
    ORDER BY c.created_at DESC
    LIMIT ${count};
  `);

  return result.map(
    (row) =>
      ({
        name: row.comic_name,
        slug: row.comic_slug,
        coverImage: row.comic_cover_image,
        issues: new Array(row.comic_issue_count).fill(null),
        tags: row.tag_names.split(',').map((tag: string) => ({
          name: tag,
          slug: row.tag_slugs.split(',')[row.tag_names.split(',').indexOf(tag)],
        })),
      } as IComic)
  );
};

const _getRandomComics = async (count = 10): Promise<Partial<IComic[]>> => {
  const result = await runSQL(`
    SELECT
      c.id as comic_id,
      c.name as comic_name,
      c.slug as comic_slug,
      c.cover_image as comic_cover_image,
      c.release_date as comic_release_date,
      issue_count
    FROM comic c
    JOIN (
      SELECT comic_id, COUNT(*) as issue_count FROM issue GROUP BY comic_id
    ) i ON i.comic_id = c.id
    ORDER BY RAND()
    LIMIT ${count};
  `);

  return result.map(
    (comic) =>
      ({
        id: comic.comic_id,
        name: comic.comic_name,
        slug: comic.comic_slug,
        coverImage: comic.comic_cover_image,
        releaseDate: comic.comic_release_date,
        issues: new Array(comic.issue_count).fill(null),
      } as IComic)
  );
};

export default Home;
