import { IComicDocument, IIssueDocument } from '~/lib/database/models';
import { ICardItem } from './CardList';

const issueToCardListProp = (issue: IIssueDocument): ICardItem => {
  return {
    image: (issue.images as string[])[0],
    href: `/comic/${issue.comic.slug}/${issue.slug}`,
    title: issue.comic.name,
    subtitle: issue.name,
  };
};

const comicToCardListProp = (comic: IComicDocument): ICardItem => {
  return {
    image: comic.coverImage as string,
    href: `/comic/${comic.slug}`,
    title: comic.name,
    subtitle: `${(comic.issues as []).length} Issues`,
  };
};

export { issueToCardListProp, comicToCardListProp };
