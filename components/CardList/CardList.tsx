import { IComicDocument, IIssueDocument } from '~/lib/database/models';
import { Card } from './Card';

interface ICardListProps {
  issues?: IIssueDocument[];
  comics?: IComicDocument[];
  responsive?: boolean;
}

const CardList = ({ issues, comics, responsive = true }: ICardListProps) => {
  let itemsDOM = null;
  if (issues) {
    itemsDOM = issues.map((item) => {
      return (
        <Card
          key={`${item.comic.name}, ${item.name}`}
          image={(item.images as string[])[0]}
          href={`/comic/${item.comic.slug}/${item.slug}`}
          mainText={item.comic.name}
          subText={item.name}
          responsive={responsive}
        />
      );
    });
  }

  if (comics) {
    itemsDOM = comics.map((item) => {
      return (
        <Card
          key={item.name}
          image={item.coverImage as string}
          href={`/comic/${item.slug}`}
          mainText={item.name}
          subText={`${(item.issues as []).length} Issues`}
          responsive={responsive}
        />
      );
    });
  }

  const responsiveClasses =
    'flex flex-nowrap overflow-x-auto xs:grid xs:grid-cols-2 xs:gap-2 xs:overflow-x-visible sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
  const classes =
    'grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';

  return (
    <div className={responsive ? responsiveClasses : classes}>{itemsDOM}</div>
  );
};

export { CardList };
