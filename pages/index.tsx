import type { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { LatestIssues } from '~/components/LatestIssues';
import { Sidebar } from '~/components/Sidebar';
import { getAllComics, getLatestIssues } from '~/lib/database';
import { IComicDocument, IIssueDocument } from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';
import { handle } from '~/lib/utils/promise';

interface IHomePageProps {
  newIssues: IIssueDocument[];
  popularComics: IComicDocument[];
}

const Home: NextPage<IHomePageProps> = ({
  newIssues,
  popularComics,
}: IHomePageProps) => {
  return (
    <Container>
      <div>
        <h2 className="mb-2 text-xl font-medium">Popular Publishers</h2>
        <div className="min-h-fit sm:flex sm:gap-x-2 sm:justify-center">
          <Link href="/tag/marvel">
            <a className="group block relative rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 sm:w-1/2">
              <Image
                src="/images/logo_marvel.png"
                className="rounded-md group-hover:brightness-[0.2] transition duration-100"
                layout="intrinsic"
                width={640}
                height={320}
                alt="Logo of Marvel"
              />
              <div className="absolute top-1/2 left-1/2 w-full text-lg font-medium text-center text-white opacity-0 group-hover:opacity-100 transition duration-100 -translate-x-1/2 -translate-y-1/2">
                <p className="">Read Latest Marvel Comics</p>
              </div>
            </a>
          </Link>
          <Link href="/tag/dc-comics">
            <a className="group block relative rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 sm:w-1/2">
              <Image
                src="/images/logo_dc_comics.png"
                className="rounded-md group-hover:brightness-[0.2] transition duration-100"
                layout="intrinsic"
                width={640}
                height={320}
                alt="Logo of Marvel"
              />
              <div className="absolute top-1/2 left-1/2 w-full text-lg font-medium text-center text-white opacity-0 group-hover:opacity-100 transition duration-100 -translate-x-1/2 -translate-y-1/2">
                <p className="">Read Latest DC Comics</p>
              </div>
            </a>
          </Link>
        </div>
      </div>
      <div className="md:flex md:justify-center">
        <div className="w-full">
          <h2 className="mb-2 text-xl font-medium">Latest Issues</h2>
          <LatestIssues issues={newIssues} />
        </div>
        <Sidebar>
          <h2 className="mb-2 text-xl font-medium whitespace-pre-wrap">
            Most Popular Comics
          </h2>
          <div>
            {popularComics.map((comic, idx) => (
              <Link href={`/comic/${comic.slug}`} key={comic.slug}>
                <a className="group flex p-2 mb-2 bg-neutral-900 hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100">
                  <p className="mr-2 text-xl font-medium text-white group-hover:text-red-500">
                    {idx + 1}.
                  </p>
                  <div className="flex justify-between self-center w-full group-hover:text-white transition duration-100">
                    <span>{comic.name}</span>
                    <div>
                      {comic.totalViews || 0}
                      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
                      <i className="ml-1 align-text-top ri-eye-line ri-fw" />
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
          <div className="float-right mt-2">
            <Button type="minimal" href="/popular-comics" text="See All" />
          </div>
        </Sidebar>
      </div>
      <div></div>
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

  return {
    props: {
      newIssues,
      popularComics,
    },
  };
};

export default Home;
