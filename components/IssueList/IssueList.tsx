import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { IIssue } from '../../lib/database/models';
import { CardList } from '../CardList';
import { issueToCardListProp } from '../CardList/CardList.helper';

interface IIssueListProps {
  issues: IIssue[];
  slug: string;
}

const IssueList = ({ issues, slug }: IIssueListProps) => {
  const SLICE_COUNT = 9;
  const [searchTerm, setSearchTerm] = useState('');
  const [issuesDOM, setIssuesDOM] = useState<ReactElement[]>([]);
  const [showAll, setShowAll] = useState(false);

  const getFilteredIssues = () => {
    const filteredIssues = issues.filter(
      (issue) =>
        issue.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    );

    const finalDOM = [];

    const bigIssues = filteredIssues.slice(0, SLICE_COUNT + 1);
    const bigIssuesDOM = (
      <CardList
        items={bigIssues.map((issue) =>
          issueToCardListProp(
            issue,
            false,
            false,
            `/comic/${slug}/${issue.slug}`
          )
        )}
        responsive={false}
      />
    );

    finalDOM.push(bigIssuesDOM);

    if (showAll) {
      const smallIssues = filteredIssues.slice(SLICE_COUNT + 1);
      const smallIssuesDOM = (
        <CardList
          items={smallIssues.map((issue) =>
            issueToCardListProp(
              issue,
              true,
              false,
              `/comic/${slug}/${issue.slug}`
            )
          )}
          responsive={false}
        />
      );
      finalDOM.push(<div className="pb-2"></div>);
      finalDOM.push(smallIssuesDOM);
    }

    return finalDOM;
  };

  useEffect(() => {
    setIssuesDOM(getFilteredIssues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, slug, issues, showAll]);

  const loadMoreIssues = () => {
    setShowAll(true);
  };

  const applyFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <div className="my-2 flex justify-between">
        <h2 className="self-center text-lg font-medium text-white">Issues</h2>
        <input
          type="text"
          placeholder="Search for issue"
          className="rounded-md bg-neutral-800 p-2 text-neutral-300 ring-2 ring-neutral-700 transition duration-100 placeholder:font-medium placeholder:text-neutral-700 focus:outline-none focus:ring-red-600"
          onChange={(e) => applyFilter(e)}
        />
      </div>
      <div className="">
        {issuesDOM}
        {!showAll && issues.length > SLICE_COUNT && (
          <div className="mt-2 text-center">
            <button
              onClick={loadMoreIssues}
              className="rounded-md bg-red-600 px-4 py-2 text-white transition-colors duration-100 hover:bg-red-700"
            >
              Load All Issues
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export { IssueList };
