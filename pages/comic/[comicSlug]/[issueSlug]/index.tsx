import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useEffect } from 'react';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { Reader } from '~/components/Reader';
import { ComicIssueJsonLd } from '~/components/SEO/ComicIssueJsonLd';
import { getComicBySlug, getIssueBySlug } from '~/lib/database';
import { IComicDocument, IIssueDocument } from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';
import { toHumanReadable } from '~/lib/utils/date';
import { handle } from '~/lib/utils/promise';

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

  useEffect(() => {
    const incrementView = async () => {
      await fetch('/api/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueId: issue._id,
        }),
      });
    };

    incrementView();
  });

  const issueNavDOM = (
    <div className="flex gap-4 justify-center my-2 mx-auto md:justify-end md:w-1/2">
      {prevIssue && (
        <Button
          type="minimal"
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
    </div>
  );

  return (
    <>
      <NextSeo
        title={`${issue.name} of ${comic.name}`}
        description={`Read ${issue.name} of ${comic.name} online for free. ${
          issue.name
        } is published at ${toHumanReadable(issue.createdAt)} and has ${
          (issue.images as string[]).length
        } pages in total.`}
        openGraph={{
          images: [
            {
              url: (issue.images as string[])[0],
              alt: `Cover image of ${issue.name} of ${comic.name} comic.`,
            },
          ],
        }}
      />
      <ComicIssueJsonLd
        issueNumber={issue.name
          .replace('Issue', '')
          .replace('#', '')
          .replace(' ', '')}
        pageStart={1}
        pageEnd={(issue.images as string[]).length}
      />
      <div>
        <Container className="p-2 bg-neutral-900 rounded-md">
          <p className="text-sm">
            <span className="font-medium text-red-600">Tip:</span> You can
            navigate using A, D or{' '}
            {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
            <i className="align-middle ri-arrow-left-line" />,{' '}
            {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
            <i className="align-middle ri-arrow-right-line" /> arrow keys and
            zoom in and out using Z key.
          </p>
        </Container>
        <div className="mx-auto mt-4 md:flex md:justify-between md:max-w-4xl">
          <h1 className="self-center mx-auto font-medium text-center md:w-1/2 md:text-left">
            Back to{' '}
            <Button
              href={`/comic/${comic.slug}`}
              text="Comic Page"
              type="minimal"
            />
          </h1>
          <h2 className="grow self-center mt-2 min-w-max text-lg font-medium text-center md:mt-0">
            {issue.name}
          </h2>
          {issueNavDOM}
        </div>
        <Reader images={issue.images as string[]} onFinished={goNextIssue} />
      </div>
    </>
  );
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  comicSlug: string;
  issueSlug: string;
}

// We are not generating and /[comicSlug]/[issueSlug] pages because
// we only want to generate those pages when /[comicSlug] page is
// generated.
export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  return {
    paths: [],
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
  const [comicError, comic] = await handle(
    callDb(
      getComicBySlug(comicSlug, 'name slug issues', [
        { fieldName: 'issues', fields: 'name images slug' },
      ]),
      true
    )
  );

  if (comicError) {
    return {
      notFound: true,
    };
  }

  const comicIssues = comic.issues as IIssueDocument[];
  const [issueError, issue] = await handle(
    callDb(getIssueBySlug(comicSlug, issueSlug), true)
  );
  if (issueError) {
    throw issueError;
  }

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
