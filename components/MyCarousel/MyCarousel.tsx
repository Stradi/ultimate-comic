import Image from 'next/image';
import { ReactElement } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Button } from '../Button';

interface ICarouselItem {
  image: string;
  title: string;
  meta?: ReactElement;
  subtitle: string;
  href: string;
  buttonText: string;
}

interface IMyCarouselProps {
  items: ICarouselItem[];
}

const MyCarousel = ({ items }: IMyCarouselProps) => {
  let itemsDOM = null;
  const imageClasses = 'w-full md:h-[500px] h-[300px]';
  itemsDOM = items.map((item, idx) => {
    return (
      <div className={imageClasses} key={item.title}>
        <div className="z-50 flex h-full flex-col bg-gradient-to-t from-[#0d0d0d] to-transparent px-4 text-left text-white sm:px-16">
          <div className="mt-auto flex flex-col gap-2 pb-8 sm:pb-16">
            <p className="text-3xl font-bold sm:text-6xl">{item.title}</p>
            {item.meta && (
              <div className="text-base sm:text-lg">{item.meta}</div>
            )}
            <p className="text-base line-clamp-2 sm:text-lg">{item.subtitle}</p>
            <div className="mt-2">
              <Button href={item.href} text={item.buttonText} type="default" />
            </div>
          </div>
        </div>
        <div className="absolute top-0 -z-10 h-full w-full">
          <Image
            src={item.image}
            layout="fill"
            objectFit="cover"
            objectPosition="top"
            alt={item.title}
            priority={idx === 0 ? true : false}
            sizes={'(max-width: 640px) 50vw, 33vw'}
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
        {itemsDOM}
      </Carousel>
    </div>
  );
};

export { MyCarousel, type IMyCarouselProps, type ICarouselItem };
