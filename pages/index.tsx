import type { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { BigComicList } from '~/components/BigComicList';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { GuideList } from '~/components/GuideList';
import { LatestIssues } from '~/components/LatestIssues';
import { SearchInput } from '~/components/SearchInput';
import { Sidebar } from '~/components/Sidebar';
import { getAllComics, getComicCount, getLatestIssues } from '~/lib/database';
import { IComicDocument, IIssueDocument } from '~/lib/database/models';
import { getAllGuides } from '~/lib/utils/blog';
import { callDb } from '~/lib/utils/database';
import { handle } from '~/lib/utils/promise';

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
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Container>
      <div>
        <h1 className="-mb-4 text-center text-xl font-medium">
          Search our extensive comic database
        </h1>
        <SearchInput
          onChange={(e) => {
            e.preventDefault();
            setSearchTerm(e.target.value);
          }}
          displayButton={true}
          buttonHref={`/search?q=${searchTerm}`}
        />
      </div>
      <div className="md:flex md:flex-row">
        <div className="mx-2 md:w-3/4">
          <h2 className="mb-2 text-xl font-medium">Latest Issues</h2>
          <LatestIssues issues={newIssues} />
        </div>
        <Sidebar>
          <h2 className="mb-2 whitespace-pre-wrap text-xl font-medium">
            Most Popular Comics
          </h2>
          <div>
            {popularComics.map((comic, idx) => (
              <Link
                href={`/comic/${comic.slug}`}
                key={comic.slug}
                prefetch={false}
              >
                <a className="group mb-2 flex rounded-md bg-neutral-900 p-2 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600">
                  <p className="mr-2 text-xl font-medium text-white group-hover:text-red-500">
                    {idx + 1}.
                  </p>
                  <div className="flex w-full justify-between self-center transition duration-100 group-hover:text-white">
                    <span className="line-clamp-2">{comic.name}</span>
                    <div>
                      {comic.totalViews || 0}
                      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                      <i className="ri-eye-line ri-fw ml-1 align-text-top" />
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
          <div className="mt-2 flex justify-end">
            <Button type="minimal" href="/popular-comics" text="See All" />
          </div>
        </Sidebar>
      </div>
      <div className="mt-4">
        <h2 className="text-center text-xl font-medium">Can&apos;t decide?</h2>
        <p className="mb-2 text-center">Here are some random comics for you</p>
        <BigComicList comics={randomComics} />
      </div>
      <div className="mt-4">
        <h2 className="text-center text-xl font-medium">
          Still can&apos;t descide?
        </h2>
        <p className="mb-2 text-center">Then check out some of our guides</p>
        <GuideList guides={guides} />
      </div>
    </Container>
  );
};

export const getStaticProps: GetStaticProps<IHomePageProps> = async () => {
  const [newIssuesError, newIssues] = await handle(
    callDb(
      getLatestIssues(
        18,
        0,
        'name slug images.0 comic createdAt',
        [
          {
            fieldName: 'comic',
            fields: 'name slug',
          },
        ],
        {},
        {
          createdAt: 'descending',
        }
      ),
      true
    )
  );

  if (newIssuesError) {
    throw newIssuesError;
  }

  const filteredNewIssues = newIssues.filter((issue) => issue.comic?.slug);

  const [popularComicsError, popularComics] = await handle(
    callDb(
      getAllComics(
        10,
        0,
        'name slug coverImage totalViews',
        [],
        {},
        {
          totalViews: 'descending',
        }
      ),
      true
    )
  );

  if (popularComicsError) {
    throw popularComicsError;
  }

  const [comicCountError, comicCount] = await handle(callDb(getComicCount()));
  if (comicCountError) return Promise.reject(comicCountError);

  //TODO: Find a real way to get random sample from comics collection.
  const skipCount = Math.floor(Math.random() * comicCount);
  const [randomComicsError, randomComics] = await handle(
    callDb(
      getAllComics(
        10,
        skipCount,
        'name slug coverImage releaseDate totalViews issues'
      ),
      true
    )
  );

  if (randomComicsError) return Promise.reject(randomComicsError);

  const [guidesError, guides] = await handle(getAllGuides());
  if (guidesError) return Promise.reject(guidesError);

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
