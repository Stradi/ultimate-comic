import { IComicDocument, IIssueDocument } from '~/lib/database/models';
import { Card } from './Card';

interface ICardListProps {
  issues?: IIssueDocument[];
  comics?: IComicDocument[];
}

const CardList = ({ issues, comics }: ICardListProps) => {
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
        />
      );
    });
  }

  return (
    <div className="flex flex-nowrap overflow-x-auto xs:grid xs:grid-cols-2 xs:gap-2 xs:overflow-x-visible sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {itemsDOM}
    </div>
  );
};

export { CardList };
