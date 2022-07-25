import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  NextPage,
} from 'next';
import { NextSeo } from 'next-seo';
import { ParsedUrlQuery } from 'querystring';
import { Container } from '~/components/Container';
import {
  getAllGuides,
  getGuideBySlug,
  moveImagesToPublicFolder,
} from '~/lib/utils/blog';
import { handle } from '~/lib/utils/promise';

interface IGuidePageProps {
  guide: GuidePage;
}

const GuidePage: NextPage<IGuidePageProps> = ({ guide }: IGuidePageProps) => {
  return (
    <Container>
      <NextSeo title={guide.title} description={guide.seo.description} />
      <h1 className="text-3xl font-black text-center text-white">
        {guide.title}
      </h1>
      <br></br>
      <div
        className="mx-auto prose-li:marker:font-bold prose-a:text-inherit prose-li:marker:text-red-600 hover:prose-a:text-red-600 prose-blockquote:border-l-red-600 prose-a:transition prose-a:duration-100 prose prose-invert"
        dangerouslySetInnerHTML={{
          __html: guide.content,
        }}
      ></div>
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
    };
  }

  moveImagesToPublicFolder(slug, 'guide');

  return {
    props: {
      guide: JSON.parse(JSON.stringify(guide)),
    },
  };
};

export default GuidePage;
