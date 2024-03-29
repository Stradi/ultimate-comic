import { PAGES } from 'configs/ui';
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
import { Section } from '~/components/Section';
import { runSQL } from '~/lib/database';
import { IComic } from '~/lib/database/models';

interface IComicWithLetterPageProps {
  comics: IComic[];
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
      className="m-0.5 inline-block rounded-md bg-neutral-800 px-2 transition duration-100 hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
    >
      {char === '#' ? '#' : char.toUpperCase()}
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
        <Section
          title={`${readableLetter.toUpperCase()}`}
          subtitle={`Comics starting with ${readableLetter.toUpperCase()}`}
          showSeeAllButton={false}
        >
          <>
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
                    className="rounded-md bg-neutral-900 px-2 py-1 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                    <i className="ri-arrow-left-s-line ri-fw align-middle" />
                  </Link>
                  <Link
                    href={`/all-comics/${letter}/${pageNo - 1}`}
                    prefetch={false}
                    className="rounded-md bg-neutral-900 px-3 py-1 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    {pageNo - 1}
                  </Link>
                </>
              ) : (
                <>
                  <div className="rounded-md bg-black/50 px-3 py-1 hover:cursor-not-allowed">
                    -
                  </div>
                  <div className="rounded-md bg-black/50 px-3 py-1 hover:cursor-not-allowed">
                    -
                  </div>
                </>
              )}
              <div className="rounded-md bg-neutral-800 px-3 py-1">
                {pageNo}
              </div>
              {comics.length == PAGES.ALL_COMICS.COMIC_PER_PAGE ? (
                <>
                  <Link
                    href={`/all-comics/${letter}/${pageNo + 1}`}
                    prefetch={false}
                    className="rounded-md bg-neutral-900 px-3 py-1 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    {pageNo + 1}
                  </Link>
                  <Link
                    href={`/all-comics/${letter}/${pageNo + 1}`}
                    prefetch={false}
                    className="rounded-md bg-neutral-900 px-2 py-1 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                    <i className="ri-arrow-right-s-line ri-fw align-middle" />
                  </Link>
                </>
              ) : (
                <>
                  <div className="rounded-md bg-black/50 px-3 py-1 hover:cursor-not-allowed">
                    -
                  </div>
                  <div className="rounded-md bg-black/50 px-3 py-1 hover:cursor-not-allowed">
                    -
                  </div>
                </>
              )}
            </div>
          </>
        </Section>
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
  let likeParam = `${letter}%`;
  if (ALPHABET.indexOf(letter) === -1) {
    readableLetter = '#';
    likeParam = '%';
  }

  const comics = await _getComicsStartingWith(
    likeParam,
    pageNo,
    PAGES.ALL_COMICS.COMIC_PER_PAGE
  );

  return {
    props: {
      comics,
      readableLetter,
      letter,
      pageNo: pageNo,
    },
  };
};

const _getComicsStartingWith = async (
  letter: string,
  pageNo: number,
  pageLength: number
) => {
  const result = await runSQL(`
    SELECT
      c.id as comic_id,
      c.name as comic_name,
      c.slug as comic_slug,
      GROUP_CONCAT(t.name) as tags,
      issue_count
    FROM comic c
    LEFT JOIN comic_tag ct ON c.id = ct.comic_id
    LEFT JOIN tag t ON ct.tag_id = t.id
    JOIN (
      SELECT comic_id, COUNT(*) as issue_count FROM issue GROUP BY comic_id
    ) i ON c.id = i.comic_id
    WHERE c.name LIKE '${letter}%'
    GROUP BY c.id
    ORDER BY c.name
    LIMIT ${pageNo * pageLength}, ${pageLength};
  `);

  return result.map(
    (comic) =>
      ({
        id: comic.comic_id,
        name: comic.comic_name,
        slug: comic.comic_slug,
        tags: comic.tags.split(',').map((tag: string) => ({ name: tag })),
        issues: new Array(comic.issue_count).fill(null),
      } as IComic)
  );
};

export default ComicWithLetterPage;
