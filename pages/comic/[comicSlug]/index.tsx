import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import Image from 'next/image';
import { ParsedUrlQuery } from 'querystring';
import { Container } from '~/components/Container';
import { IssueList } from '~/components/IssueList';
import { getAllComics, getComicBySlug } from '~/lib/database';
import { IComicDocument, IIssueDocument } from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';

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
  const tags = comic.tags?.map((tag) => tag.name) as string[];
  const issues = comic.issues as IIssueDocument[];

  return (
    <Container className="px-2">
      <div className="gap-4 sm:flex">
        <div className="mx-auto w-3/4 sm:mx-0 sm:w-1/3">
          <Image
            src={comic.coverImage as string}
            layout="responsive"
            width={1}
            height={1.35}
            alt={`${comic.name} cover image`}
            className="rounded-xl"
            priority
          />
        </div>
        <div className="sm:w-2/3">
          <h1 className="mb-2 text-3xl text-center sm:text-4xl sm:text-left">
            {comic.name}
          </h1>
          <p className="text-xl">Release Year:</p>
          <p>{releaseDate.getFullYear()}</p>
          <p className="text-xl">Authors:</p>
          <p>{authors.join(',')}</p>
          <p className="text-xl">Tags:</p>
          <p>{tags.join(',')}</p>
          <br></br>
        </div>
      </div>
      <div>
        <p className="text-xl">Summary:</p>
        <p>{comic.summary}</p>
      </div>
      <IssueList issues={issues} slug={comic.slug} />
    </Container>
  );
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  comicSlug: string;
}

export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  const slugs = (await callDb(getAllComics(-1, 0, 'slug'))).map(
    (comic) => comic.slug
  );

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
  const comic = await callDb(
    getComicBySlug(
      slug,
      'name slug isCompleted releaseDate coverImage summary authors tags issues',
      ['authors', 'tags', 'issues']
    ),
    true
  );

  return {
    props: {
      comic,
    },
  };
};

export default ComicSlugPage;
