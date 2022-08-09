import Image from 'next/image';
import Link from 'next/link';

interface ICardProps {
  image: string;
  href: string;
  mainText: string;
  subText: string;
}

const Card = ({ image, href, mainText, subText }: ICardProps) => {
  return (
    <Link href={href}>
      <a
        className="flex w-8/12 shrink-0 rounded-md p-1 xs:block xs:w-full xs:transition-shadow xs:duration-100 xs:hover:ring-2 xs:hover:ring-red-600"
        title={`${mainText}, ${subText}`}
      >
        <div className="flex aspect-[1/1.3] w-full flex-col xs:w-auto">
          <div className="relative h-full w-full">
            <Image
              src={image}
              layout="fill"
              width={100}
              height={130}
              sizes={'(max-width: 640px) 50vw, 20vw'}
              className="rounded-md"
              alt={mainText}
            />
          </div>
          <p
            className="text-lg font-medium text-white line-clamp-1"
            title={mainText}
          >
            {mainText}
          </p>
          <p>{subText}</p>
        </div>
      </a>
    </Link>
  );
};

export { Card };
