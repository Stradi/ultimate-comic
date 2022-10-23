import Link from 'next/link';
import React from 'react';
import { ICarouselItem } from '~/components/MyCarousel/MyCarousel';
import { IComic, ITag } from '~/lib/database/models';

const comicToMyCarouselProp = (comic: IComic): ICarouselItem => {
  const metaDOM = React.createElement('div', null, [
    `${(comic.issues as []).length} Issues`,
    ' · ',
    ...(comic.tags as ITag[]).map((tag) => {
      return React.createElement(
        Link,
        { href: `/tag/${tag.slug}`, key: `${comic.name}, ${tag.name}` },
        `${tag.name} `
      );
    }),
  ]);

  return {
    image: comic.coverImage as string,
    title: comic.name,
    subtitle: comic.summary as string,
    buttonText: 'Read Now',
    href: `/comic/${comic.slug}`,
    meta: metaDOM,
  };
};

const guideToMyCarouselProp = (guide: GuidePage): ICarouselItem => {
  return {
    image: guide.coverImage,
    title: guide.title,
    subtitle: guide.excerpt,
    buttonText: 'Read Now',
    href: `/guides/${guide.slug}`,
  };
};

export { comicToMyCarouselProp, guideToMyCarouselProp };
