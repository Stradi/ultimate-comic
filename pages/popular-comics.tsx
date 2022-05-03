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
        description="Most popular comics in our comics database. See which comic have most views and read it for free. Marvel, DC Comics, Valiant Comics and more."
      />
      <Container>
        <h1 className="block mb-2 text-lg font-medium text-center text-white">
          Most Popular 100 Comics
        </h1>
        <p className="p-2 mb-2 text-sm bg-neutral-900 rounded-md">
          <span className="font-medium text-red-600">Note:</span> Completed
          comics have checkmark (
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          <i className="text-green-500 align-middle ri-check-line ri-fw" />) on
          left, ongoing comics have cross (
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          <i className="text-red-500 align-middle ri-close-line ri-fw" />
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
