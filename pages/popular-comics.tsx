import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Container } from '~/components/Container';
import { MiniComicList } from '~/components/MiniComicList';
import { getAllComics } from '~/lib/database';
import { IComicDocument } from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';
import { handle } from '~/lib/utils/promise';

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
        description="Most popular comics in our extensive comic database. See which comic have most views and read it for free. Marvel, DC Comics, Valiant Comics and more."
      />
      <Container>
        <h1 className="mb-2 block text-center text-lg font-medium text-white">
          Most Popular 100 Comics
        </h1>
        <p className="mb-2 rounded-md bg-neutral-900 p-2 text-sm">
          <span className="font-medium text-red-600">Note:</span> Completed
          comics have checkmark (
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          <i className="ri-check-line ri-fw align-middle text-green-500" />) on
          left, ongoing comics have cross (
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          <i className="ri-close-line ri-fw align-middle text-red-500" />
          ). Hover a comic to see its total view count.
        </p>
        <MiniComicList comics={comics} addViewCount />
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<
  IPopularComicsPageProps
> = async () => {
  const [error, popularComics] = await handle(
    callDb(
      getAllComics(
        100,
        0,
        'name slug isCompleted totalViews',
        [],
        {},
        { totalViews: 'descending' }
      ),
      true
    )
  );

  if (error) {
    throw error;
  }

  return {
    props: {
      comics: popularComics,
    },
  };
};

export default PopularComicsPage;
