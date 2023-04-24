import { IMAGE } from 'configs/ui';
import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';
import { useEffect } from 'react';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { NewReader } from '~/components/NewReader';
import { ComicIssueJsonLd } from '~/components/SEO/ComicIssueJsonLd';
import { runSQL } from '~/lib/database';
import { IComic, IIssue } from '~/lib/database/models';
import { toHumanReadable } from '~/lib/utils/date';
import { sendComicReadEvent } from '~/lib/utils/gtag';
import { resizeImage } from '~/lib/utils/image';

interface IIssueSlugPageProps {
  issue: IIssue;
  comic: IComic;
  nextIssue: IIssue | null;
  prevIssue: IIssue | null;
}

const IssueSlugPage: NextPage<IIssueSlugPageProps> = ({
  issue,
  comic,
  nextIssue,
  prevIssue,
}: IIssueSlugPageProps) => {
  useEffect(() => {
    const incrementView = async () => {
      await fetch('/api/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          issueId: issue.id,
        }),
      });
    };

    incrementView();
    sendComicReadEvent(comic.slug, issue.slug);
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
        {(issue.images as string[]).length > 0 ? (
          <>
            <NewReader images={issue.images as string[]} />
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
          </>
        ) : (
          <div className="mt-32 text-center sm:mt-44">
            <p className="text-4xl font-medium text-white">
              Looks like this issue doesn&apos;t exists.
            </p>
            <p className="text-xl">
              We will try to add this issue fast as possible.
            </p>
          </div>
        )}
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

  const currentIssue = await _getIssue(comicSlug, issueSlug);

  // TODO: Currently we are just getting next and previous
  // issues based on 'SOMETHING' scope in `issue-SOMETHING-NUMBER` slug.
  // We can recursively get next and previous issues by popping 'SOMETHING'.
  const nextIssue = await _getNextIssue(currentIssue);
  const previousIssue = await _getPreviousIssue(currentIssue);

  return {
    props: {
      issue: JSON.parse(JSON.stringify(currentIssue)),
      comic: currentIssue.comic as IComic,
      nextIssue: JSON.parse(JSON.stringify(nextIssue)) || null,
      prevIssue: JSON.parse(JSON.stringify(previousIssue)) || null,
      key: currentIssue.id,
    },
  };
};

const _getIssue = async (comicSlug: string, issueSlug: string) => {
  const result = await runSQL(`
    SELECT
      i.id as issue_id,
      i.name as issue_name,
      i.slug as issue_slug,
      i.created_at as issue_created_at,
      c.name as comic_name,
      c.slug as comic_slug,
      p.url as page_url
    FROM issue i
    JOIN comic c ON c.id = i.comic_id
    JOIN page p ON p.issue_id = i.id
    WHERE c.slug = '${comicSlug}' AND i.slug = '${issueSlug}'
  `);

  return {
    id: result[0].issue_id,
    name: result[0].issue_name,
    slug: result[0].issue_slug,
    createdAt: result[0].issue_created_at,
    comic: {
      name: result[0].comic_name,
      slug: result[0].comic_slug,
    },
    images: result.map((r) => resizeImage(r.page_url, IMAGE.SIZES.LARGE)),
  } as IIssue;
};

const _getPreviousIssue = async (currentIssue: IIssue) => {
  const splittedSlug = currentIssue.slug.split('-');
  const currentIssueNo = Number.parseInt(splittedSlug.pop() as string);
  const previousIssueSlug = `${splittedSlug.join('-')}-${currentIssueNo - 1}`;

  const isExists = await _isIssueExists(currentIssue, previousIssueSlug);
  if (isExists) {
    return {
      slug: previousIssueSlug,
    } as IIssue;
  }

  return null;
};

const _getNextIssue = async (currentIssue: IIssue) => {
  const splittedSlug = currentIssue.slug.split('-');
  const currentIssueNo = Number.parseInt(splittedSlug.pop() as string);
  const nextIssueSlug = `${splittedSlug.join('-')}-${currentIssueNo + 1}`;

  const isExists = await _isIssueExists(currentIssue, nextIssueSlug);
  if (isExists) {
    return {
      slug: nextIssueSlug,
    } as IIssue;
  }

  return null;
};

const _isIssueExists = async (currentIssue: IIssue, slug: string) => {
  const result = await runSQL(`
    SELECT 1
    FROM issue i
    JOIN comic c ON c.id = i.comic_id
    WHERE c.slug = '${currentIssue.comic.slug}' AND i.slug = '${slug}';
  `);

  return result.length > 0;
};

export default IssueSlugPage;
