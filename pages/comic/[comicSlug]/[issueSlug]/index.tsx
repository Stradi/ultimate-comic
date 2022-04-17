import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getAllComics, getIssueBySlug } from '~/lib/database';
import { IIssueDocument } from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';

interface IIssueSlugPageProps {
  issue: IIssueDocument;
}

const IssueSlugPage: NextPage<IIssueSlugPageProps> = ({
  issue,
}: IIssueSlugPageProps) => {
  return <div>Issue slug page</div>;
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  comicSlug: string;
  issueSlug: string;
}

export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  const comics = (
    await callDb(getAllComics(-1, 0, 'slug issues', ['issues']))
  ).map((comic) => {
    const issues = comic.issues as IIssueDocument[];
    const issueSlugs = issues.map((issue) => issue.slug);
    return {
      slug: comic.slug,
      issues: issueSlugs,
    };
  });

  const paths = [];
  for (const comic of comics) {
    for (const iSlug of comic.issues) {
      paths.push({
        params: {
          comicSlug: comic.slug,
          issueSlug: iSlug,
        },
      });
    }
  }

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  IIssueSlugPageProps,
  IStaticPathsQuery
> = async (context: GetStaticPropsContext<IStaticPathsQuery>) => {
  const slugs = context.params as IStaticPathsQuery;
  const comicSlug = slugs.comicSlug;
  const issueSlug = slugs.issueSlug;

  const issue = await callDb(getIssueBySlug(comicSlug, issueSlug), true);

  return {
    props: {
      issue,
    },
  };
};

export default IssueSlugPage;
