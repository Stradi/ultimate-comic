import {
  IComicDocument,
  IIssueDocument,
  ITagDocument,
} from '~/lib/database/models';
import { ICardItem } from './CardList';

const issueToCardListProp = (
  issue: IIssueDocument,
  mini = false
): ICardItem => {
  return {
    image: (issue.images as string[])[0],
    href: `/comic/${issue.comic.slug}/${issue.slug}`,
    title: issue.comic.name,
    subtitle: issue.name,
    mini,
  };
};

const comicToCardListProp = (
  comic: IComicDocument,
  mini = false
): ICardItem => {
  return {
    image: comic.coverImage as string,
    href: `/comic/${comic.slug}`,
    title: comic.name,
    subtitle: `${(comic.issues as []).length} Issues`,
    mini,
  };
};

const tagToCardListProps = (tag: ITagDocument): ICardItem => {
  return {
    href: `/tag/${tag.slug}`,
    title: tag.name,
    subtitle: '',
    image: '',
    mini: true,
  };
};

export { issueToCardListProp, comicToCardListProp, tagToCardListProps };
