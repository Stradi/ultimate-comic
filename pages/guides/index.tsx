import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { CardList } from '~/components/CardList';
import { guideToCardListProps } from '~/components/CardList/CardList.helper';
import { Container } from '~/components/Container';
import { Section } from '~/components/Section';
import { getAllGuides } from '~/lib/utils/blog';
import { handle } from '~/lib/utils/promise';

interface IGuideListPageProps {
  guides: GuidePage[];
}

// TODO: Add pagination
const GuideListPage: NextPage<IGuideListPageProps> = ({
  guides,
}: IGuideListPageProps) => {
  return (
    <Container>
      <NextSeo
        title="Guides"
        description="Don't know where to start reading a comic. Check out these extensive guides we prepared for different characters and events."
      />
      <Section
        title="All Guides"
        subtitle="All of our guides for specific characters and events"
        showSeeAllButton={false}
      >
        {guides.length > 0 ? (
          <div>
            <CardList
              items={guides.map((guide) => guideToCardListProps(guide))}
              responsive={false}
            />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl font-medium">There are no guides, yet.</p>
          </div>
        )}
      </Section>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<IGuideListPageProps> = async () => {
  const [, allGuides] = await handle(getAllGuides());

  return {
    props: {
      guides: allGuides ? JSON.parse(JSON.stringify(allGuides)) : [],
    },
  };
};

export default GuideListPage;
