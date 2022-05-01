import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { MiniComicList } from '~/components/MiniComicList';
import { getAllTags, getTagBySlug } from '~/lib/database';
import { IComicDocument, ITagDocument } from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';

interface ITagPageProps {
  tag: ITagDocument;
}

const TagPage: NextPage<ITagPageProps> = ({ tag }: ITagPageProps) => {
  const comics = tag.comics as IComicDocument[];
  return (
    <>
      <NextSeo
        title={`${tag.name}`}
        description={`Read the latest and most popular comics about ${tag.name} online for free.`}
      />
      <Container>
        <h1 className="block p-2 mb-2 text-lg font-medium text-center bg-neutral-900 rounded-md">
          Comics about <span className="text-white">{tag.name}</span>
        </h1>
        {comics.length > 0 ? (
          <MiniComicList comics={comics} />
        ) : (
          <div className="text-center">
            <p className="mb-4 text-xl font-medium">No comics found</p>
            <Button
              href="/all-comics/0"
              text="Go to All Comics"
              type="default"
            />{' '}
          </div>
        )}
      </Container>
    </>
  );
};

interface IStaticPathsQuery extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths<IStaticPathsQuery> = async () => {
  const tags = (await callDb(getAllTags(5, 0, 'slug'))).map((tag) => tag.slug);

  const paths = tags.map((slug) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<
  ITagPageProps,
  IStaticPathsQuery
> = async (context: GetStaticPropsContext<IStaticPathsQuery>) => {
  const slug = (context.params as IStaticPathsQuery).slug;
  const tag = await callDb(
    getTagBySlug(slug, 'name slug comics', [
      {
        fieldName: 'comics',
        fields: 'name slug isCompleted',
      },
    ]),
    true
  );

  //Show only N amount of comics.
  // tag.comics = tag.comics?.slice(0, N);

  return {
    props: {
      tag,
    },
  };
};

export default TagPage;
