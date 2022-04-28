import { IComicDocument } from '~/lib/database/models';
import { SingleComic } from './SingleComic';

interface IMiniComicListProps {
  comics: IComicDocument[];
}

const MiniComicList = ({ comics }: IMiniComicListProps) => {
  const comicsDOM = comics.map((comic) => (
    <SingleComic comic={comic} key={comic.slug} />
  ));
  return (
    <div className="sm:grid sm:grid-cols-2 sm:gap-2 sm:my-0 md:grid-cols-4">
      {comicsDOM}
    </div>
  );
};

export { MiniComicList };
