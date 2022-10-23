import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { MDXRemote } from 'next-mdx-remote';
import { NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';
import { Container } from '~/components/Container';
import { getAllGuides, getGuideBySlug } from '~/lib/utils/blog';
import { handle } from '~/lib/utils/promise';

import { CardList } from '~/components/CardList';
import { comicToCardListProp } from '~/components/CardList/CardList.helper';
import MDXComponents from '~/components/MDXComponents';
import { IComic } from '~/lib/database/models';
import { toHumanReadable } from '~/lib/utils/date';
import { convertFromCamelCase } from '~/lib/utils/text';

interface IGuidePageProps {
  guide: GuidePage;
  metadata: GuideMetadata;
  related: IComic[];
}

const GuidePage: NextPage<IGuidePageProps> = ({
  guide,
  metadata,
  related,
}: IGuidePageProps) => {
  const metadataTableDOM = Object.keys(metadata).map((name) => {
    if (name === 'related') {
      return null;
    }
    const label = convertFromCamelCase(name);
    const rawValue = metadata[name as keyof GuideMetadata];
    let value = null;
    if (Array.isArray(rawValue)) {
      value = rawValue.map((v) => <p key={v}>{v}</p>);
    } else {
      value = rawValue;
    }

    return (
      <tr key={label} className="border-b border-neutral-800">
        <td className="font-medium text-neutral-100">{label}</td>
        <td className="text-sm">{value}</td>
      </tr>
    );
  });

  return (
    <Container>
      <div className="sm:flex sm:justify-between">
        <div className="mx-auto w-full sm:w-2/3">
          <NextSeo
            title={`${guide.title} Guide`}
            description={guide.seo.description}
          />
          <h1 className="text-center text-5xl font-bold text-white">
            {guide.title} Guide
          </h1>
          <br></br>
          <div className="flex flex-col text-center text-sm">
            <p>
              <span className="text-neutral-400">By </span>
              <span className="font-medium text-neutral-100">
                UltimateComic staff
              </span>
            </p>
            <p>
              Published at{' '}
              <span className="font-medium text-neutral-100">
                {toHumanReadable(guide.publishedAt)}
              </span>
              , last updated at{' '}
              <span className="font-medium text-neutral-100">
                {toHumanReadable(guide.updatedAt)}
              </span>
            </p>
          </div>
          <br></br>
          <div className="prose-lg prose prose-invert mx-auto max-w-full prose-h1:mb-2 prose-a:text-inherit prose-a:transition prose-a:duration-100 hover:prose-a:text-red-600 prose-blockquote:border-l-red-600 prose-li:marker:font-bold prose-li:marker:text-red-600 prose-img:my-0 prose-img:p-2">
            <p>{guide.excerpt}</p>
            <MDXRemote {...guide.content} components={MDXComponents} />
          </div>
        </div>
        <aside className="inset-y-0 block h-full w-full rounded-lg sm:sticky sm:h-screen sm:w-1/4 sm:overflow-y-auto sm:overflow-x-hidden">
          <div>
            <h2 className="pl-2 text-2xl font-medium text-white">
              General Information
            </h2>
            <div className="mr-2 rounded-md bg-neutral-900 px-2 pt-2">
              <table className="w-full">
                <tbody>{metadataTableDOM}</tbody>
              </table>
            </div>
          </div>
          {related.length > 0 && (
            <div className="mt-4">
              <h2 className="pl-2 text-2xl font-medium text-white">
                Related Comics
              </h2>
              <div className="pt-2 sm:h-screen">
                <CardList
                  items={related.map((relatedComic) =>
                    comicToCardListProp(relatedComic, true)
                  )}
                  responsive={false}
                  singleColumn={true}
                />
              </div>
            </div>
          )}
        </aside>
      </div>
    </Container>
  );
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  const [error, guides] = await handle(getAllGuides());
  if (error) return { paths: [], fallback: 'blocking' };

  const paths = guides.map((guide) => ({
    params: { slug: guide.slug },
  }));
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  IGuidePageProps,
  IStaticPathsQuery
> = async (context: GetStaticPropsContext<IStaticPathsQuery>) => {
  const slug = (context.params as IStaticPathsQuery).slug;
  const [error, guide] = await handle(getGuideBySlug(slug));

  if (error) {
    return {
      notFound: true,
      revalidate: 120,
    };
  }

  const relatedComics: IComic[] = [];
  // if (guide.metadata.related) {
  //   for (const relatedComic of guide.metadata.related) {
  //     const [error, comic] = await callDb(
  //       handle(
  //         getComicBySlug(relatedComic, 'name slug tags issues', [
  //           {
  //             fieldName: 'tags',
  //             fields: 'name',
  //           },
  //         ])
  //       ),
  //       true
  //     );

  //     if (!error && comic !== null) {
  //       relatedComics.push(comic as IComic);
  //     }
  //   }
  // }

  return {
    props: {
      guide: JSON.parse(JSON.stringify(guide)),
      metadata: (guide as GuidePage).metadata,
      related: relatedComics,
    },
  };
};

export default GuidePage;
