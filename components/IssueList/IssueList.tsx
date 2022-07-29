import Image from 'next/image';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { IIssueDocument } from '../../lib/database/models';
import { SingleIssue } from './SingleIssue';

interface IIssueListProps {
  issues: IIssueDocument[];
  slug: string;
}

//TODO: Refactor if you can
const IssueList = ({ issues, slug }: IIssueListProps) => {
  const SLICE_COUNT = 7;
  const [searchTerm, setSearchTerm] = useState('');
  const [issuesDOM, setIssuesDOM] = useState<ReactElement[]>([]);
  const [showAll, setShowAll] = useState(false);

  const getFilteredIssues = () => {
    const filteredIssues = issues.filter(
      (issue) =>
        issue.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
    );

    if (showAll) {
      const bigIssues = filteredIssues
        .slice(0, SLICE_COUNT + 1)
        .map((issue) => (
          <SingleIssue
            issue={issue}
            key={issue._id}
            href={`${slug}/${issue.slug}`}
            isBig={true}
          />
        ));

      const smallIssues = filteredIssues
        .slice(SLICE_COUNT + 1)
        .map((issue) => (
          <SingleIssue
            issue={issue}
            key={issue._id}
            href={`${slug}/${issue.slug}`}
            isBig={false}
          />
        ));

      return [...bigIssues, ...smallIssues];
    } else {
      return filteredIssues
        .slice(0, SLICE_COUNT)
        .map((issue) => (
          <SingleIssue
            issue={issue}
            key={issue._id}
            href={`${slug}/${issue.slug}`}
            isBig={true}
          />
        ));
    }
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
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {issuesDOM}
        {/* Render load more button if user didn't click it yet. */}
        {!showAll && issues.length > SLICE_COUNT && (
          <button className="group relative" onClick={loadMoreIssues}>
            <Image
              unoptimized
              className="rounded-md transition duration-100 group-hover:brightness-[0.5]"
              src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNU/Q8AAU8BJijqIsEAAAAASUVORK5CYII="
              layout="responsive"
              width={1}
              height={1.3}
              alt="load more issues"
            />
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-white transition duration-100 group-hover:scale-110">
              Load More
            </p>
          </button>
        )}
      </div>
    </div>
  );
};

export { IssueList };
