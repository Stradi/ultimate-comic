import { GetStaticProps, NextPage } from 'next';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Container } from '~/components/Container';
import { getComicCount, getIssueCount } from '~/lib/database';
import { callDb } from '~/lib/utils/database';
import { handle } from '~/lib/utils/promise';

import debounce from 'lodash.debounce';
import { NextSeo } from 'next-seo';
import { BigComicList } from '~/components/BigComicList';
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
  const [searchResults, setSearchResults] = useState<SearchResult>();
  const [error, setError] = useState({});

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const fn = async () => {
      const [error, response] = await handle(
        fetch(
          `api/search?term=${searchTerm}&fields=name slug coverImage createdAt totalViews issues&type=comics&count=20`
        )
      );

      if (error) {
        setError(error);
        return;
      }

      const searchResults = (await response.json()) as SearchResult;
      setSearchResults(searchResults);
    };

    if (searchTerm !== '') {
      fn();
    }
  }, [searchTerm]);

  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 500),
    []
  );

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, [debouncedChangeHandler]);

  return (
    <>
      <NextSeo
        title="Search"
        description={`Search in more than ${comicCount} comics and ${issueCount} issues. In other words, world's biggest comic database.`}
      />
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
        <div className="flex relative items-center my-8 mx-auto w-1/3 h-full">
          <input
            type={'text'}
            className="absolute top-0 left-0 p-2 pl-9 w-full placeholder:font-medium placeholder:text-neutral-700 text-neutral-300 focus:placeholder:text-neutral-500 bg-neutral-800 rounded-md focus:outline-none ring-2 ring-neutral-700 focus:ring-red-600 transition duration-100"
            placeholder="Search..."
            onChange={debouncedChangeHandler}
          />
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          <i className="z-10 py-3 px-2 font-medium text-neutral-500 ri-search-line ri-lg" />
        </div>
        {searchResults && (
          <div>
            {searchResults.comics.length > 0 && (
              <div className="my-4">
                <h2 className="mb-4 text-lg text-center">
                  We found these comics about &apos;
                  <span className="font-bold text-red-500">{searchTerm}</span>
                  &apos;
                </h2>
                <BigComicList comics={searchResults.comics} />
              </div>
            )}
          </div>
        )}
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