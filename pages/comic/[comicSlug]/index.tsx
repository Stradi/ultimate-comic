import { PAGES } from 'configs/ui';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import { ParsedUrlQuery } from 'querystring';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { IssueList } from '~/components/IssueList';
import { ComicSeriesJsonLd } from '~/components/SEO/ComicSeriesJsonLd';
import { getAllComics, getComicBySlug } from '~/lib/database';
import {
  IComicDocument,
  IIssueDocument,
  ITagDocument,
} from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';
import { toHumanReadable } from '~/lib/utils/date';
import { handle } from '~/lib/utils/promise';

interface IComicSlugPageProps {
  comic: IComicDocument;
}

const ComicSlugPage: NextPage<IComicSlugPageProps> = ({
  comic,
}: IComicSlugPageProps) => {
  const releaseDate = new Date(
    Date.parse((comic.releaseDate as Date).toString())
  );
  const authors = comic.authors?.map((author) => author.name) as string[];
  const issues = comic.issues as IIssueDocument[];

  const tagsDOM = (comic.tags as ITagDocument[]).map((tag) => (
    <Button
      href={`/tag/${tag.slug}`}
      text={tag.name}
      type="minimal"
      key={tag.slug}
    />
  ));

  return (
    <>
      <NextSeo
        title={comic.name}
        description={`Read the latest issue of ${
          comic.name
        } for free. Currently ${comic.name} has ${
          issues.length
        } issues and latest issue is ${
          issues[issues.length - 1].name
        } is published at ${toHumanReadable(
          issues[issues.length - 1].createdAt
        )}.`}
        openGraph={{
          images: [
            {
              url: comic.coverImage as string,
              alt: `Cover image of ${comic.name} comic.`,
            },
          ],
        }}
      />
      <ComicSeriesJsonLd
        name={comic.name}
        description={comic.summary as string}
        startDate={releaseDate.getFullYear()}
      />
      <Container className="px-2">
        <div className="md:flex">
          <div className="mx-auto w-10/12 sm:w-3/5 md:w-2/5 lg:w-1/3">
            <Image
              src={comic.coverImage as string}
              layout="responsive"
              width={1}
              height={1.35}
              alt={`${comic.name} cover image`}
              className="rounded-md"
              priority
            />
          </div>
          <div className="p-4 m-auto w-full bg-neutral-900 rounded-md sm:w-10/12 md:w-3/5 md:rounded-r-md md:rounded-l-none lg:w-2/3">
            <h1 className="mb-2 text-2xl font-medium text-left text-white">
              {comic.name}
            </h1>
            <div className="my-4">{tagsDOM}</div>
            <p className="my-2 font-medium text-white">Summary:</p>
            <p className="text-sm">{comic.summary}</p>
            <div className="grid grid-cols-3 my-2">
              <div>
                <span className="font-medium text-white">Authors:</span>
                <br></br>
                <span className="text-sm">{authors}</span>
              </div>
              <div>
                <span className="font-medium text-white">Status:</span>{' '}
                <br></br>
                <span className="text-sm">
                  {comic.isCompleted ? 'Completed' : 'Ongoing'}
                </span>
              </div>
              <div>
                <span className="font-medium text-white">Release Year:</span>{' '}
                <br></br>
                <span className="text-sm">{releaseDate.getFullYear()}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                href={`/comic/${comic.slug}/${issues[issues.length - 1].slug}`}
                text="Read First Issue"
                type="minimal"
              />
              <Button
                href={`/comic/${comic.slug}/${issues[0].slug}`}
                text="Read Latest Issue"
                type="default"
              />
            </div>
          </div>
        </div>
        <IssueList issues={issues} slug={comic.slug} />
      </Container>
    </>
  );
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  comicSlug: string;
}

export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  const slugs = (
    await callDb(
      getAllComics(
        PAGES.COMIC.GENERATE_ON_BUILD,
        0,
        'slug',
        [],
        {},
        { totalViews: 'descending' }
      )
    )
  ).map((comic) => comic.slug);

  const paths = slugs.map((slug) => ({
    params: { comicSlug: slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  IComicSlugPageProps,
  IStaticPathsQuery
> = async (context: GetStaticPropsContext<IStaticPathsQuery>) => {
  const slug = (context.params as IStaticPathsQuery).comicSlug;
  const [error, comic] = await handle(
    callDb(
      getComicBySlug(
        slug,
        'name slug isCompleted releaseDate coverImage summary authors tags issues',
        [
          { fieldName: 'authors', fields: 'name' },
          { fieldName: 'tags', fields: 'name slug' },
          { fieldName: 'issues', fields: 'name slug createdAt images.0' },
        ]
      ),
      true
    )
  );

  if (error) {
    throw error;
  }

  return {
    props: {
      comic,
    },
  };
};

export default ComicSlugPage;
