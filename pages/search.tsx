import { GetStaticProps, NextPage } from 'next';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Container } from '~/components/Container';
import { getComicCount, getIssueCount } from '~/lib/database';
import { callDb } from '~/lib/utils/database';
import { handle } from '~/lib/utils/promise';

import debounce from 'lodash.debounce';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { SearchInput } from '~/components/SearchInput';
import { parseQuery } from '~/lib/utils/api';
import { SearchResult } from '~/lib/utils/search';
import { CardList } from '~/components/CardList';
import { comicToCardListProp } from '~/components/CardList/CardList.helper';
import { Section } from '~/components/Section';

interface ISearchPageProps {
  comicCount: number;
  issueCount: number;
}

const SearchPage: NextPage<ISearchPageProps> = ({
  comicCount,
  issueCount,
}: ISearchPageProps) => {
  const COMICS_TO_SHOW = 10;

  const router = useRouter();
  const query = parseQuery(router.query, ['q']);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult>();
  const [, setError] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [skipCount, setSkipCount] = useState(0);

  useEffect(() => {
    setSearchTerm((query.q as string) || '');
  }, [query.q]);

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSkipCount(0);
    setSearchResults({
      comics: [],
      tags: [],
    });
    router.push(
      {
        pathname: '/search',
        query: {
          q: event.target.value,
        },
      },
      undefined,
      {
        shallow: true,
      }
    );
  };

  const loadMore = () => {
    setSkipCount(skipCount + COMICS_TO_SHOW);
  };

  const isSearchTermValid = useCallback(() => {
    if (searchTerm.length < 3) {
      setError('You must enter more than 3 characters.');
      return false;
    }

    return true;
  }, [searchTerm]);

  useEffect(() => {
    const fn = async () => {
      setIsLoading(true);
      const [error, response] = await handle(
        fetch(
          `/api/search?term=${searchTerm}&fields=name slug coverImage issues&type=comics&count=${COMICS_TO_SHOW}&skip=${skipCount}`
        )
      );
      setIsLoading(false);

      if (error) {
        setError(error);
        return;
      }

      const newResults = (await response.json()) as SearchResult;
      if (searchResults) {
        setSearchResults({
          comics: [...searchResults.comics, ...newResults.comics],
          tags: [...searchResults.tags, ...newResults.tags],
        });
      } else {
        setSearchResults(newResults);
      }
    };

    if (isSearchTermValid()) {
      fn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, skipCount, isSearchTermValid]);

  const debouncedChangeHandler = useMemo(
    () => debounce(changeHandler, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Section
          title="Search"
          subtitle={`More than ${comicCount} comics and ${issueCount} issues.`}
          showSeeAllButton={false}
        >
          <div className="flex flex-col justify-center gap-2">
            <SearchInput
              onChange={debouncedChangeHandler}
              initialValue={(query.q as string) || ''}
            />
            {searchResults && (
              <Section
                title="Results"
                subtitle={`Results for '${searchTerm}'`}
                showSeeAllButton={false}
              >
                <>
                  {isLoading && (
                    <div>
                      <div className="flex justify-center">
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {searchResults.comics.length > 0 && (
                    <>
                      <CardList
                        items={searchResults.comics.map((comic) =>
                          comicToCardListProp(comic)
                        )}
                        responsive={false}
                      />
                      {searchResults.comics.length ===
                        COMICS_TO_SHOW + skipCount && (
                        <button
                          onClick={loadMore}
                          className="mx-auto block rounded-md bg-red-600 px-4 py-2 text-white transition duration-100 hover:bg-red-700"
                        >
                          Load More
                        </button>
                      )}
                    </>
                  )}
                  {searchResults.comics.length === 0 && (
                    <div className="flex flex-col justify-center gap-2">
                      <p className="text-center text-xl font-medium text-white">
                        No comics found for &apos;
                        <span className="font-medium text-red-500">
                          {searchTerm}
                        </span>
                        &apos;
                      </p>
                    </div>
                  )}
                </>
              </Section>
            )}
          </div>
        </Section>
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<ISearchPageProps> = async () => {
  const comicCount = await callDb(getComicCount());
  const issueCount = await callDb(getIssueCount());

  return {
    props: {
      comicCount: Math.round(comicCount / 1000) * 1000,
      issueCount: Math.round(issueCount / 10000) * 10000,
    },
  };
};

export default SearchPage;
