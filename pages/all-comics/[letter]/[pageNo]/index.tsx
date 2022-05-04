import { PAGES } from 'configs/ui';
import mongoose from 'mongoose';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { Container } from '~/components/Container';
import { MiniComicList } from '~/components/MiniComicList';
import { getAllComics } from '~/lib/database';
import { IComicDocument } from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';
import { handle } from '~/lib/utils/promise';

interface IComicWithLetterPageProps {
  comics: IComicDocument[];
  readableLetter: string;
  letter: string;
  pageNo: number;
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

const ComicWithLetterPage: NextPage<IComicWithLetterPageProps> = ({
  comics,
  readableLetter,
  letter,
  pageNo,
}: IComicWithLetterPageProps) => {
  const letterNavigationLinksDOM = `#${ALPHABET}`.split('').map((char) => (
    <Link
      href={`/all-comics/${char === '#' ? '0' : char}`}
      key={char === '#' ? '0' : char}
    >
      <a className="inline-block px-2 m-0.5 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100">
        {char === '#' ? '#' : char.toUpperCase()}
      </a>
    </Link>
  ));

  const letterNavigationDOM = (
    <div className="block p-2 my-2 text-center bg-neutral-900 rounded-md">
      {letterNavigationLinksDOM}
    </div>
  );

  return (
    <>
      <NextSeo
        title="All Comics"
        description="Full list of the largest comics database for Marvel, DC Comics, Dark Horse Comics, Image Comics, Valiant Comics, IDW Publishing Comics and more."
      />
      <Container>
        <h1 className="block mb-2 text-lg font-medium text-center text-white">
          {readableLetter.toUpperCase()}
        </h1>
        {letterNavigationDOM}
        <p className="p-2 mb-2 text-sm bg-neutral-900 rounded-md">
          <span className="font-medium text-red-600">Note:</span> Completed
          comics have checkmark (
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          <i className="text-green-500 align-middle ri-check-line ri-fw" />) on
          left, ongoing comics have cross (
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          <i className="text-red-500 align-middle ri-close-line ri-fw" />
          ).
        </p>
        {comics.length > 0 ? (
          <MiniComicList comics={comics} />
        ) : (
          <div className="mb-2 text-center">
            <p className="text-xl font-medium">No comics found</p>
            <p className="text-sm text-neutral-500">
              Try selecting another letter
            </p>
          </div>
        )}
        {comics.length > 0 && letterNavigationDOM}
        <div className="flex gap-1 justify-center">
          {pageNo !== 0 ? (
            <>
              <Link href={`/all-comics/${letter}/${pageNo - 1}`}>
                <a className="py-1 px-2 bg-neutral-900 hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100">
                  {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                  <i className="align-middle ri-arrow-left-s-line ri-fw" />
                </a>
              </Link>
              <Link href={`/all-comics/${letter}/${pageNo - 1}`}>
                <a className="py-1 px-3 bg-neutral-900 hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100">
                  {pageNo - 1}
                </a>
              </Link>
            </>
          ) : (
            <>
              <div className="py-1 px-3 bg-black/50 rounded-md hover:cursor-not-allowed">
                -
              </div>
              <div className="py-1 px-3 bg-black/50 rounded-md hover:cursor-not-allowed">
                -
              </div>
            </>
          )}
          <div className="py-1 px-3 bg-neutral-800 rounded-md">{pageNo}</div>
          {comics.length == PAGES.ALL_COMICS.COMIC_PER_PAGE ? (
            <>
              <Link href={`/all-comics/${letter}/${pageNo + 1}`}>
                <a className="py-1 px-3 bg-neutral-900 hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100">
                  {pageNo + 1}
                </a>
              </Link>
              <Link href={`/all-comics/${letter}/${pageNo + 1}`}>
                <a className="py-1 px-2 bg-neutral-900 hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100">
                  {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                  <i className="align-middle ri-arrow-right-s-line ri-fw" />
                </a>
              </Link>
            </>
          ) : (
            <>
              <div className="py-1 px-3 bg-black/50 rounded-md hover:cursor-not-allowed">
                -
              </div>
              <div className="py-1 px-3 bg-black/50 rounded-md hover:cursor-not-allowed">
                -
              </div>
            </>
          )}
        </div>
      </Container>
    </>
  );
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  letter: string;
  pageNo: string;
}

export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  const alphabetStr = `${ALPHABET}0`;
  const paths = alphabetStr.split('').map((char) => ({
    params: { letter: char, pageNo: '0' },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  IComicWithLetterPageProps,
  IStaticPathsQuery
> = async (context: GetStaticPropsContext<IStaticPathsQuery>) => {
  const params = context.params as IStaticPathsQuery;
  const letter = params.letter;
  const pageNo = Number.parseInt(params.pageNo);

  let readableLetter = letter;
  let regexStr = '';
  if (ALPHABET.indexOf(letter) === -1) {
    regexStr = '^[^a-zA-Z]';
    readableLetter = '#';
  } else {
    regexStr = '^' + letter;
  }

  const filter: mongoose.FilterQuery<IComicDocument> = {
    name: new RegExp(regexStr, 'i'),
  };

  const [error, comics] = await handle(
    callDb(
      getAllComics(
        PAGES.ALL_COMICS.COMIC_PER_PAGE,
        pageNo * PAGES.ALL_COMICS.COMIC_PER_PAGE,
        'name slug isCompleted',
        [],
        filter
      ),
      true
    )
  );

  if (error) {
    throw error;
  }

  return {
    props: {
      comics,
      readableLetter,
      letter,
      pageNo: pageNo,
    },
  };
};

export default ComicWithLetterPage;
