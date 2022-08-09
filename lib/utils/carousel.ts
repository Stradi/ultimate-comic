import React from 'react';
import Link from 'next/link';
import { ICarouselItem } from '~/components/MyCarousel/MyCarousel';
import { IComicDocument, ITagDocument } from '../database/models';

const convertComicToCarouselProp = (comic: IComicDocument): ICarouselItem => {
  const metaDOM = React.createElement('div', null, [
    `${(comic.issues as []).length} Issues`,
    ' · ',
    ...(comic.tags as ITagDocument[]).map((tag) => {
      return React.createElement(
        Link,
        { href: `/tag/${tag.slug}` },
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
    meta: React.createElement('div', null, [metaDOM]),
  };
};

const convertGuideToCarouselProp = (guide: GuidePage): ICarouselItem => {
  return {
    image: guide.coverImage,
    title: guide.title,
    subtitle: guide.excerpt,
    buttonText: 'Read Now',
    href: `/guides/${guide.slug}`,
  };
};

export { convertComicToCarouselProp, convertGuideToCarouselProp };
