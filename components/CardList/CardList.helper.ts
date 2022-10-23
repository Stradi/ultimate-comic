import { IComic, IIssue, ITag } from '~/lib/database/models';
import { ICardItem } from './CardList';

const issueToCardListProp = (
  issue: IIssue,
  mini = false,
  showSubtitle = true,
  customURL = ''
): ICardItem => {
  return {
    image: (issue.images as string[]) ? (issue.images as string[])[0] : '',
    href: customURL || `/comic/${issue.comic.slug}/${issue.slug}`,
    title: showSubtitle ? issue.comic.name : issue.name,
    subtitle: showSubtitle ? issue.name : '',
    mini,
  };
};

const comicToCardListProp = (comic: IComic, mini = false): ICardItem => {
  let subtitle = '';
  if (mini) {
    const subtitleTags = (comic.tags as ITag[])
      .map((tag) => tag.name)
      .join(', ');
    subtitle = `${(comic.issues as []).length} Issues, ${subtitleTags}`;
  } else {
    subtitle = `${(comic.issues as []).length} Issues`;
  }

  return {
    image: comic.coverImage as string,
    href: `/comic/${comic.slug}`,
    title: comic.name,
    subtitle,
    mini,
  };
};

const tagToCardListProps = (tag: ITag): ICardItem => {
  return {
    href: `/tag/${tag.slug}`,
    title: tag.name,
    subtitle: `${(tag.comics as IComic[]).length} Comics`,
    image: '',
    mini: true,
  };
};

const guideToCardListProps = (guide: GuidePage): ICardItem => {
  return {
    image: guide.coverImage,
    href: `/guides/${guide.slug}`,
    title: guide.title,
    subtitle: '',
  };
};

export {
  issueToCardListProp,
  comicToCardListProp,
  tagToCardListProps,
  guideToCardListProps,
};
