import type { GetStaticProps, NextPage } from 'next';
import { CardList } from '~/components/CardList';
import { Container } from '~/components/Container';
import { MyCarousel } from '~/components/MyCarousel';
import { Section } from '~/components/Section';
import { getAllComics, getLatestIssues, getSampleComics } from '~/lib/database';
import { IComicDocument, IIssueDocument } from '~/lib/database/models';
import { getAllGuides } from '~/lib/utils/blog';
import {
  convertComicToCarouselProp,
  convertGuideToCarouselProp,
} from '~/lib/utils/carousel';
import { callDb } from '~/lib/utils/database';

interface IHomePageProps {
  newIssues: IIssueDocument[];
  popularComics: IComicDocument[];
  randomComics: IComicDocument[];
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
        items={[
          ...popularComics.map((comic) => convertComicToCarouselProp(comic)),
        ]}
      />
      <Section
        title="Latest Issues"
        subtitle="Issues fresh out of oven"
        showSeeAllButton={true}
        seeAllButtonHref="/latest-issues"
      >
        <CardList issues={newIssues} />
      </Section>
      <Section
        title="Popular Comics"
        subtitle="Most read comics in UltimateComic"
        showSeeAllButton={true}
        seeAllButtonHref="/popular-comics"
      >
        <CardList comics={popularComics} />
      </Section>
      <Section
        title="Can't Decide?"
        subtitle="Here are some random comics for you"
        showSeeAllButton={false}
      >
        <CardList comics={randomComics} />
      </Section>
      <Section
        title="Still Can't Decide?"
        subtitle="We got you. We also prepared some detailed guides for you"
        showSeeAllButton={true}
        seeAllButtonHref="/guides"
      >
        <MyCarousel
          items={[...guides.map((guide) => convertGuideToCarouselProp(guide))]}
        />
      </Section>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<IHomePageProps> = async () => {
  const newIssues = await callDb(
    getLatestIssues(
      10,
      0,
      'name slug images.0 comic createdAt',
      [
        {
          fieldName: 'comic',
          fields: 'name slug',
        },
      ],
      {
        'images.0': {
          $exists: true,
        },
      },
      {
        createdAt: 'descending',
      }
    ),
    true
  );

  const filteredNewIssues = newIssues.filter((issue) => issue.comic?.slug);

  const popularComics = await callDb(
    getAllComics(
      5,
      0,
      'name slug coverImage summary viewCount issues tags',
      [
        {
          fieldName: 'tags',
          fields: 'name slug',
        },
      ],
      {
        coverImage: {
          $ne: null,
        },
        summary: {
          $ne: 'N/a',
        },
      },
      {
        viewCount: 'descending',
      }
    ),
    true
  );

  const randomComics = await callDb(
    getSampleComics(5, 'name slug coverImage releaseDate viewCount issues'),
    true
  );

  const guides = await getAllGuides();

  return {
    props: {
      newIssues: filteredNewIssues,
      popularComics,
      randomComics,
      guides: guides ? JSON.parse(JSON.stringify(guides.slice(0, 3))) : [],
    },
    // Currently Netlify doesn't support On-demand revalidation,
    // so /api/revalidate route doesn't work. Instead we can use ISR.
    // TODO: Remove this when @netlify/plugin-nextjs supports on-demand
    // revalidation.
    revalidate: 60,
  };
};

export default Home;
