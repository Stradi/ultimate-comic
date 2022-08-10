import Image from 'next/image';
import Link from 'next/link';

import cx from 'classnames';

interface ICardProps {
  image: string;
  href: string;
  title: string;
  subtitle: string;
  responsive?: boolean;
  mini?: boolean;
}

const Card = ({
  image,
  href,
  title,
  subtitle,
  responsive = true,
  mini = false,
}: ICardProps) => {
  if (mini) {
    return <MiniCard href={href} title={title} subtitle={subtitle} />;
  } else {
    return (
      <BigCard
        image={image}
        href={href}
        title={title}
        subtitle={subtitle}
        responsive={responsive}
      />
    );
  }
};

type IMiniCardProps = Pick<ICardProps, 'href' | 'title' | 'subtitle'>;
const MiniCard = ({ href, title, subtitle }: IMiniCardProps) => {
  return (
    <Link href={href} prefetch={false}>
      <a
        className="group rounded-md bg-neutral-900 p-2 xs:transition-shadow xs:duration-100 xs:hover:ring-2 xs:hover:ring-red-600"
        title={`${title}, ${subtitle}`}
      >
        <p className="text-base transition-colors duration-100 line-clamp-1 group-hover:text-white xs:text-lg">
          {title}
        </p>
        <p className="truncate text-sm text-neutral-400 group-hover:text-neutral-200">
          {subtitle}
        </p>
      </a>
    </Link>
  );
};

type IBigCardProps = Pick<
  ICardProps,
  'image' | 'href' | 'title' | 'subtitle' | 'responsive'
>;
const BigCard = ({
  image,
  href,
  title,
  subtitle,
  responsive = true,
}: IBigCardProps) => {
  const anchorClasses = cx({
    'rounded-md p-1 xs:transition-shadow xs:duration-100 xs:hover:ring-2 xs:hover:ring-red-600':
      true,
    'flex w-8/12 shrink-0 xs:block xs:w-full': responsive,
  });

  const divClasses = cx({
    'aspect-[1/1.3]': true,
    'flex w-full flex-col xs:w-auto': responsive,
  });

  return (
    <Link href={href} prefetch={false}>
      <a className={anchorClasses} title={`${title}, ${subtitle}`}>
        <div className={divClasses}>
          <div className="relative h-full w-full">
            <Image
              src={
                image ||
                'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNU/Q8AAU8BJijqIsEAAAAASUVORK5CYII='
              }
              layout="fill"
              sizes={'(max-width: 640px) 50vw, 20vw'}
              className="rounded-md"
              alt={title}
            />
          </div>
          <p
            className="text-lg font-medium text-white line-clamp-1"
            title={title}
          >
            {title}
          </p>
          <p>{subtitle}</p>
        </div>
      </a>
    </Link>
  );
};

export { Card };
