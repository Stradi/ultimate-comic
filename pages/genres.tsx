import { GetStaticProps, NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { Container } from '~/components/Container';
import { MiniTagList } from '~/components/MiniTagList';
import { getAllTags } from '~/lib/database';
import { IComicDocument, ITagDocument } from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';
import { handle } from '~/lib/utils/promise';

interface IGenresPageProps {
  tags: ITagDocument[];
}

const GenresPage: NextPage<IGenresPageProps> = ({ tags }: IGenresPageProps) => {
  return (
    <>
      <NextSeo
        title="Genres"
        description="Most popular genres in comic history."
      />
      <Container>
        <h1 className="block mb-2 text-lg font-medium text-center text-white">
          Most Popular Genres
        </h1>
        <p className="p-2 mb-2 text-sm bg-neutral-900 rounded-md">
          <span className="font-medium text-red-600">Note:</span> Hover to see
          comic count of the genre.
        </p>
        <MiniTagList tags={tags} />
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps<IGenresPageProps> = async () => {
  const [error, tags] = await handle(
    callDb(getAllTags(-1, 0, 'slug name comics'), true)
  );
  if (error) {
    throw error;
  }

  return {
    props: {
      tags: tags.sort(
        (a, b) =>
          (b.comics as IComicDocument[]).length -
          (a.comics as IComicDocument[]).length
      ),
    },
  };
};

export default GenresPage;
