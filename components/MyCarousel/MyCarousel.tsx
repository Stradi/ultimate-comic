import Image from 'next/image';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import {
  IComicDocument,
  IIssueDocument,
  ITagDocument,
} from '~/lib/database/models';
import { Button } from '../Button';

interface MyCarouselProps {
  items: IComicDocument[];
}

const MyCarousel = ({ items }: MyCarouselProps) => {
  const elements = items.map((item) => {
    const imageClasses = `w-full md:h-[500px] h-[300px]`;

    const comicItem = item as IComicDocument;
    const issueCount = (comicItem.issues as IIssueDocument[]).length;
    const tagsDOM = (comicItem.tags as ITagDocument[]).map((tag) => (
      <Link href={`tag/${tag.slug}`} key={tag.slug}>
        {`${tag.name} `}
      </Link>
    ));

    return (
      <div className={imageClasses} key="">
        <div className="z-50 flex h-full flex-col bg-gradient-to-t from-[#0d0d0d] to-transparent px-4 text-left text-white sm:px-16">
          <div className="mt-auto flex flex-col gap-2 pb-8 sm:pb-16">
            <p className="text-3xl font-bold sm:text-6xl">{comicItem.name}</p>
            <p className="text-lg sm:text-xl">
              {issueCount} Issues · {tagsDOM}
            </p>
            <p className="text-base line-clamp-2 sm:text-lg">
              {comicItem.summary}
            </p>
            <div className="mt-2">
              <Button
                href={`/comic/${comicItem.slug}`}
                text="Read Now"
                type="default"
              />
            </div>
          </div>
        </div>
        <div className="absolute top-0 -z-10 h-full w-full">
          <Image
            src={item.coverImage as string}
            layout="fill"
            objectFit="cover"
            objectPosition="top"
            alt=""
            priority={true}
          />
        </div>
      </div>
    );
  });

  return (
    <div className="select-none">
      <Carousel
        showThumbs={false}
        emulateTouch={true}
        showStatus={false}
        infiniteLoop={true}
        showArrows={false}
      >
        {elements}
      </Carousel>
    </div>
  );
};

export { MyCarousel };
