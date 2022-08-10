import { Card } from './Card';

interface ICardItem {
  image: string;
  href: string;
  title: string;
  subtitle: string;
  // mini?: boolean;
}

interface ICardListProps {
  items: ICardItem[];
  responsive?: boolean;
}

const CardList = ({ items, responsive = true }: ICardListProps) => {
  let itemsDOM = null;
  itemsDOM = items.map((item) => {
    return (
      <Card
        key={`${item.title}, ${item.subtitle}`}
        image={item.image}
        href={item.href}
        title={item.title}
        subtitle={item.subtitle}
        responsive={responsive}
      />
    );
  });

  const responsiveClasses =
    'flex flex-nowrap overflow-x-auto xs:grid xs:grid-cols-2 xs:gap-2 xs:overflow-x-visible sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
  const classes =
    'grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';

  return (
    <div className={responsive ? responsiveClasses : classes}>{itemsDOM}</div>
  );
};

export { CardList, type ICardItem };
