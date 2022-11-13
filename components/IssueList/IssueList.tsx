import useWindowSize from 'hooks/useWindowSize';
import { useEffect, useState } from 'react';
import { IIssue } from '../../lib/database/models';
import { CardList } from '../CardList';
import { issueToCardListProp } from '../CardList/CardList.helper';
import { Section } from '../Section';

interface IIssueListProps {
  issues: { [key: string]: IIssue[] };
  slug: string;
}

const IssueList = ({ issues, slug }: IIssueListProps) => {
  const [sliceCount, setSliceCount] = useState(0);
  const { width } = useWindowSize();

  // This approach looks silly, but it's the only way I could get it to work.
  // Change it if you can.
  useEffect(() => {
    if (width > 1024) {
      setSliceCount(10);
    } else if (width > 768) {
      setSliceCount(8);
    } else if (width > 640) {
      setSliceCount(6);
    } else {
      setSliceCount(4);
    }
  }, [width]);

  return (
    <div>
      {Object.keys(issues)
        .sort((a, b) => {
          return issues[b].length - issues[a].length;
        })
        .map((issueGroup) => {
          return (
            <div key={issueGroup}>
              <Section title={issueGroup} subtitle="" showSeeAllButton={false}>
                <CardList
                  items={_getCardListProps(
                    issues[issueGroup],
                    slug,
                    sliceCount
                  )}
                  responsive={false}
                />
              </Section>
            </div>
          );
        })}
    </div>
  );
};

const _getCardListProps = (
  issues: IIssue[],
  comicSlug: string,
  sliceCount: number
) => {
  return issues.map((issue, idx) => {
    return issueToCardListProp(
      issue,
      idx >= sliceCount,
      false,
      `/comic/${comicSlug}/${issue.slug}`
    );
  });
};

export { IssueList };
