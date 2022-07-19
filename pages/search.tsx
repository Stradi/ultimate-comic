import { GetStaticProps, NextPage } from 'next';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Container } from '~/components/Container';
import { getComicCount, getIssueCount } from '~/lib/database';
import { callDb } from '~/lib/utils/database';
import { handle } from '~/lib/utils/promise';

import debounce from 'lodash.debounce';
import { SearchResult } from '~/lib/utils/search';

interface ISearchPageProps {
  comicCount: number;
  issueCount: number;
}

const SearchPage: NextPage<ISearchPageProps> = ({
  comicCount,
  issueCount,
}: ISearchPageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult>({
    comics: [],
    tags: [],
  });
  const [error, setError] = useState({});

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fn = async () => {
      const [error, response] = await handle(
        fetch(
          `api/search?term=${searchTerm}&fields=name slug&type=comics&count=20`
        )
      );

      if (error) {
        setError(error);
        return;
      }

      const searchResults = (await response.json()) as SearchResult;
      setSearchResults(searchResults);
    };

    fn();
  }, [searchTerm]);

  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, [debouncedChangeHandler]);

  return (
    <>
      <Container>
        <h1 className="block mb-2 text-lg font-medium text-center text-white">
          Search Comix
        </h1>
        <h2 className="block text-center text-neutral-300">
          Search in more than{' '}
          <span className="font-medium text-red-500">{comicCount}</span> comics
          and <span className="font-medium text-red-500">{issueCount}</span>{' '}
          issues
        </h2>
        <div className="flex relative items-center mx-auto mt-16 w-1/3 h-full">
          <input
            type={'text'}
            className="absolute top-0 left-0 p-2 pl-9 w-full placeholder:font-medium placeholder:text-neutral-700 text-neutral-300 focus:placeholder:text-neutral-500 bg-neutral-800 rounded-md focus:outline-none ring-2 ring-neutral-700 focus:ring-red-600 transition duration-100"
            placeholder="Search..."
            onChange={debouncedChangeHandler}
          />
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          <i className="z-10 py-3 px-2 font-medium text-neutral-500 ri-search-line ri-lg" />
        </div>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<ISearchPageProps> = async () => {
  const [comicCountError, comicCount] = await handle(callDb(getComicCount()));

  if (comicCountError) {
    return {
      notFound: true,
    };
  }

  const [issueCountError, issueCount] = await handle(callDb(getIssueCount()));

  if (issueCountError) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      comicCount: Math.round(comicCount / 1000) * 1000,
      issueCount: Math.round(issueCount / 10000) * 10000,
    },
  };
};

export default SearchPage;
