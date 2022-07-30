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
import { getAllIssues, getIssueBySlug } from '~/lib/database';
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
    <div className="my-2 mx-auto flex justify-center gap-4 md:w-1/2 md:justify-end">
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
        <Container className="rounded-md bg-neutral-900 p-2">
          <p className="text-sm">
            <span className="font-medium text-red-600">Tip:</span> You can
            navigate using A, D or{' '}
            {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
            <i className="ri-arrow-left-line align-middle" />,{' '}
            {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
            <i className="ri-arrow-right-line align-middle" /> arrow keys and
            zoom in and out using Z key.
          </p>
        </Container>
        <div className="mx-auto mt-4 md:flex md:max-w-4xl md:justify-between">
          <h1 className="mx-auto self-center text-center font-medium md:w-1/2 md:text-left">
            Back to{' '}
            <Button
              href={`/comic/${comic.slug}`}
              text="Comic Page"
              type="minimal"
            />
          </h1>
          <h2 className="mt-2 min-w-max grow self-center text-center text-lg font-medium md:mt-0">
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

  const [currentIssueError, currentIssue] = await handle(
    callDb(
      getIssueBySlug(comicSlug, issueSlug, 'name images comic createdAt', [
        {
          fieldName: 'comic',
          fields: 'name slug',
        },
      ]),
      true
    )
  );

  if (currentIssueError) {
    return {
      notFound: true,
    };
  }

  const [, nextIssue] = await handle(
    callDb(
      getAllIssues(
        1,
        0,
        'slug comic',
        [],
        {
          _id: {
            $lt: currentIssue._id,
          },
          comic: (currentIssue.comic as IComicDocument)._id,
        },
        {
          _id: 'descending',
        }
      ),
      true
    )
  );

  const [, previousIssue] = await handle(
    callDb(
      getAllIssues(
        1,
        0,
        'slug comic',
        [],
        {
          _id: {
            $gt: currentIssue._id,
          },
          comic: (currentIssue.comic as IComicDocument)._id,
        },
        {
          _id: 'ascending',
        }
      ),
      true
    )
  );

  return {
    props: {
      issue: currentIssue,
      comic: currentIssue.comic as IComicDocument,
      nextIssue: (nextIssue as IIssueDocument[])[0] || null,
      prevIssue: (previousIssue as IIssueDocument[])[0] || null,
      key: currentIssue._id,
    },
  };
};

export default IssueSlugPage;
