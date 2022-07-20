import { IComicDocument } from '~/lib/database/models';
import { SingleComic } from './SingleComic';

interface IBigComicListProps {
  comics: IComicDocument[];
}

const BigComicList = ({ comics }: IBigComicListProps) => {
  const comicsDOM = comics.map((comic) => (
    <SingleComic comic={comic} key={comic.slug} />
  ));

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{comicsDOM}</div>
  );
};

export { BigComicList };
