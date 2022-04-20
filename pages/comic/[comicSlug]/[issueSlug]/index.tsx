import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { Reader } from '~/components/Reader';
import { getAllComics, getComicBySlug, getIssueBySlug } from '~/lib/database';
import { IComicDocument, IIssueDocument } from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';

interface IIssueSlugPageProps {
  issue: IIssueDocument;
  comic: IComicDocument;
  nextIssue: IIssueDocument | null;
  prevIssue: IIssueDocument | null;
}

const IssueSlugPage: NextPage<IIssueSlugPageProps> = ({
  issue,
  comic,
  nextIssue,
  prevIssue,
}: IIssueSlugPageProps) => {
  const router = useRouter();
  const goNextIssue = () => {
    if (nextIssue) {
      router.push(`/comic/${comic.slug}/${nextIssue.slug}`);
    } else {
      router.push(`/comic/${comic.slug}`);
    }
  };

  const issueNavDOM = (
    <Container className="flex gap-4 justify-center my-2 ">
      {prevIssue && (
        <Button
          type="default"
          href={`/comic/${comic.slug}/${prevIssue.slug}`}
          text="Previous Issue"
        />
      )}
      {nextIssue && (
        <Button
          type="default"
          href={`/comic/${comic.slug}/${nextIssue.slug}`}
          text="Next Issue"
        />
      )}
    </Container>
  );

  return (
    <div>
      <h1 className="text-4xl font-medium text-center">{`${comic.name}`}</h1>
      <h2 className="text-2xl text-center">{issue.name}</h2>
      {issueNavDOM}
      <Reader images={issue.images as string[]} onFinished={goNextIssue} />
      {issueNavDOM}
    </div>
  );
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

  //TODO: We could do all of these in (probably) one getComicBySlug call.
  const comic = await callDb(
    getComicBySlug(comicSlug, 'name slug issues', ['issues']),
    true
  );

  const comicIssues = comic.issues as IIssueDocument[];
  const issue = await callDb(getIssueBySlug(comicSlug, issueSlug), true);

  const issueIndex = comicIssues.findIndex((i) => i._id == issue._id);
  const nextIssue = issueIndex === 0 ? null : comicIssues[issueIndex - 1];
  const prevIssue =
    issueIndex === comicIssues.length - 1 ? null : comicIssues[issueIndex + 1];

  return {
    props: {
      issue,
      comic,
      nextIssue,
      prevIssue,
      key: issue._id,
    },
  };
};

export default IssueSlugPage;
