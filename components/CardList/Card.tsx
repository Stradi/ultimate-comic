import Image from 'next/image';
import Link from 'next/link';

interface ICardProps {
  image: string;
  href: string;
  title: string;
  subtitle: string;
  responsive?: boolean;
}

const Card = ({
  image,
  href,
  title,
  subtitle,
  responsive = true,
}: ICardProps) => {
  const aClassesResponsive =
    'flex w-8/12 shrink-0 rounded-md p-1 xs:block xs:w-full xs:transition-shadow xs:duration-100 xs:hover:ring-2 xs:hover:ring-red-600';
  const aClasses =
    'rounded-md p-1 xs:transition-shadow xs:duration-100 xs:hover:ring-2 xs:hover:ring-red-600';

  const divClassesResponsive = 'flex aspect-[1/1.3] w-full flex-col xs:w-auto';
  const divClasses = 'aspect-[1/1.3]';

  return (
    <Link href={href} prefetch={false}>
      <a
        className={responsive ? aClassesResponsive : aClasses}
        title={`${title}, ${subtitle}`}
      >
        <div className={responsive ? divClassesResponsive : divClasses}>
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
