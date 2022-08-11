import { Card } from './Card';
import cx from 'classnames';

interface ICardItem {
  image: string;
  href: string;
  title: string;
  subtitle: string;
  mini?: boolean;
}

interface ICardListProps {
  items: ICardItem[];
  responsive?: boolean;
  singleColumn?: boolean;
}

const CardList = ({
  items,
  responsive = true,
  singleColumn = false,
}: ICardListProps) => {
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
        mini={item.mini}
      />
    );
  });

  const classes = cx({
    'flex flex-col gap-2 px-1': true,
    'sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5': !singleColumn,
    'flex flex-nowrap overflow-x-auto xs:grid xs:grid-cols-2 xs:gap-2 xs:overflow-x-visible':
      responsive && !singleColumn,
    'grid grid-cols-2 gap-2': !responsive && !singleColumn,
  });
  return <div className={classes}>{itemsDOM}</div>;
};

export { CardList, type ICardItem };
