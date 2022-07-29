import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BigComicList } from '~/components/BigComicList';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { LatestIssues } from '~/components/LatestIssues';
import { SearchInput } from '~/components/SearchInput';
import { Sidebar } from '~/components/Sidebar';
import { getAllComics, getComicCount, getLatestIssues } from '~/lib/database';
import { IComicDocument, IIssueDocument } from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';
import { handle } from '~/lib/utils/promise';

interface IHomePageProps {
  newIssues: IIssueDocument[];
  popularComics: IComicDocument[];
  randomComics: IComicDocument[];
}

const Home: NextPage<IHomePageProps> = ({
  newIssues,
  popularComics,
  randomComics,
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
      <div>
        <h2 className="mb-2 text-xl font-medium">Popular Publishers</h2>
        <div className="min-h-fit sm:flex sm:justify-center sm:gap-x-2">
          <Link href="/tag/marvel">
            <a className="group relative block rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 sm:w-1/2">
              <Image
                src="/images/logo_marvel.png"
                className="rounded-md transition duration-100 group-hover:brightness-[0.2]"
                layout="intrinsic"
                width={640}
                height={320}
                alt="Logo of Marvel"
              />
              <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center text-lg font-medium text-white opacity-0 transition duration-100 group-hover:opacity-100">
                <p className="">Read Latest Marvel Comics</p>
              </div>
            </a>
          </Link>
          <Link href="/tag/dc-comics">
            <a className="group relative block rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 sm:w-1/2">
              <Image
                src="/images/logo_dc_comics.png"
                className="rounded-md transition duration-100 group-hover:brightness-[0.2]"
                layout="intrinsic"
                width={640}
                height={320}
                alt="Logo of Marvel"
              />
              <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 text-center text-lg font-medium text-white opacity-0 transition duration-100 group-hover:opacity-100">
                <p className="">Read Latest DC Comics</p>
              </div>
            </a>
          </Link>
        </div>
      </div>
      <div className="md:flex md:flex-row">
        <div className="md:w-3/4">
          <h2 className="mb-2 text-xl font-medium">Latest Issues</h2>
          <LatestIssues issues={newIssues} />
        </div>
        <Sidebar>
          <h2 className="mb-2 whitespace-pre-wrap text-xl font-medium">
            Most Popular Comics
          </h2>
          <div>
            {popularComics.map((comic, idx) => (
              <Link href={`/comic/${comic.slug}`} key={comic.slug}>
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
        <p className="text-center">Here are some random comics of the day</p>
        <BigComicList comics={randomComics} />
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
        'name slug coverImage createdAt totalViews issues'
      ),
      true
    )
  );

  if (randomComicsError) return Promise.reject(randomComicsError);

  return {
    props: {
      newIssues: filteredNewIssues,
      popularComics,
      randomComics,
    },
    // Currently Netlify doesn't support On-demand revalidation,
    // so /api/revalidate route doesn't work. Instead we can use ISR.
    // TODO: Remove this when @netlify/plugin-nextjs supports on-demand
    // revalidation.
    revalidate: 60,
  };
};

export default Home;
