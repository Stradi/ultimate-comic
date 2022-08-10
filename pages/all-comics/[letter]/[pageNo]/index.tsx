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
import { CardList } from '~/components/CardList';
import { comicToCardListProp } from '~/components/CardList/CardList.helper';
import { Container } from '~/components/Container';
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
      prefetch={false}
    >
      <a className="m-0.5 inline-block rounded-md bg-neutral-800 px-2 transition duration-100 hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600">
        {char === '#' ? '#' : char.toUpperCase()}
      </a>
    </Link>
  ));

  const letterNavigationDOM = (
    <div className="my-2 block rounded-md bg-neutral-900 p-2 text-center">
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
        <h1 className="mb-2 block text-center text-lg font-medium text-white">
          {readableLetter.toUpperCase()}
        </h1>
        {letterNavigationDOM}
        {comics.length > 0 ? (
          <CardList
            items={comics.map((comic) => comicToCardListProp(comic, true))}
            responsive={false}
          />
        ) : (
          <div className="mb-2 text-center">
            <p className="text-xl font-medium">No comics found</p>
            <p className="text-sm text-neutral-500">
              Try selecting another letter
            </p>
          </div>
        )}
        {comics.length > 0 && letterNavigationDOM}
        <div className="flex justify-center gap-1">
          {pageNo !== 0 ? (
            <>
              <Link
                href={`/all-comics/${letter}/${pageNo - 1}`}
                prefetch={false}
              >
                <a className="rounded-md bg-neutral-900 py-1 px-2 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600">
                  {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                  <i className="ri-arrow-left-s-line ri-fw align-middle" />
                </a>
              </Link>
              <Link
                href={`/all-comics/${letter}/${pageNo - 1}`}
                prefetch={false}
              >
                <a className="rounded-md bg-neutral-900 py-1 px-3 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600">
                  {pageNo - 1}
                </a>
              </Link>
            </>
          ) : (
            <>
              <div className="rounded-md bg-black/50 py-1 px-3 hover:cursor-not-allowed">
                -
              </div>
              <div className="rounded-md bg-black/50 py-1 px-3 hover:cursor-not-allowed">
                -
              </div>
            </>
          )}
          <div className="rounded-md bg-neutral-800 py-1 px-3">{pageNo}</div>
          {comics.length == PAGES.ALL_COMICS.COMIC_PER_PAGE ? (
            <>
              <Link
                href={`/all-comics/${letter}/${pageNo + 1}`}
                prefetch={false}
              >
                <a className="rounded-md bg-neutral-900 py-1 px-3 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600">
                  {pageNo + 1}
                </a>
              </Link>
              <Link
                href={`/all-comics/${letter}/${pageNo + 1}`}
                prefetch={false}
              >
                <a className="rounded-md bg-neutral-900 py-1 px-2 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600">
                  {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                  <i className="ri-arrow-right-s-line ri-fw align-middle" />
                </a>
              </Link>
            </>
          ) : (
            <>
              <div className="rounded-md bg-black/50 py-1 px-3 hover:cursor-not-allowed">
                -
              </div>
              <div className="rounded-md bg-black/50 py-1 px-3 hover:cursor-not-allowed">
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
        'name slug issues',
        [],
        filter
      ),
      true
    )
  );

  if (error) {
    return {
      notFound: true,
      revalidate: 120,
    };
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
