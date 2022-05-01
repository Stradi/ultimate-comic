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

interface IComicWithLetterPageProps {
  comics: IComicDocument[];
  letter: string;
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

const ComicWithLetterPage: NextPage<IComicWithLetterPageProps> = ({
  comics,
  letter,
}: IComicWithLetterPageProps) => {
  const paginationLinksDOM = `#${ALPHABET}`.split('').map((char) => (
    <Link
      href={`/all-comics/${char === '#' ? '0' : char}`}
      key={char === '#' ? '0' : char}
    >
      <a className="inline-block px-2 m-0.5 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100">
        {char === '#' ? '#' : char.toUpperCase()}
      </a>
    </Link>
  ));

  const paginationDOM = (
    <div className="block p-2 my-2 text-center bg-neutral-900 rounded-md">
      {paginationLinksDOM}
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
          {letter.toUpperCase()}
        </h1>
        {paginationDOM}
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
          <div className="text-center">
            <p className="text-xl font-medium">No comics found</p>
            <p className="text-sm text-neutral-500">
              Try selecting another letter
            </p>
          </div>
        )}
        {comics.length > 0 && paginationDOM}
      </Container>
    </>
  );
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  letter: string;
}

export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  const alphabetStr = `${ALPHABET}0`;
  const paths = alphabetStr.split('').map((char) => ({
    params: { letter: char },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  IComicWithLetterPageProps,
  IStaticPathsQuery
> = async (context: GetStaticPropsContext<IStaticPathsQuery>) => {
  const letter = (context.params as IStaticPathsQuery).letter;

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

  const comics = await callDb(
    getAllComics(-1, 0, 'name slug isCompleted', [], filter),
    true
  );

  return {
    props: {
      comics,
      letter: readableLetter,
    },
  };
};

export default ComicWithLetterPage;
