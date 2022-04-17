import Image from 'next/image';
import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { IIssueDocument } from '../../lib/database/models';
import { SingleIssue } from './SingleIssue';

interface IIssueListProps {
  issues: IIssueDocument[];
  slug: string;
}

const IssueList = ({ issues, slug }: IIssueListProps) => {
  const [sliceCount, setSliceCount] = useState(7);
  const [searchTerm, setSearchTerm] = useState('');
  const [issuesDOM, setIssuesDOM] = useState<ReactElement[]>([]);

  const getFilteredIssues = () => {
    return issues
      .filter(
        (issue) =>
          issue.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
      )
      .slice(0, sliceCount)
      .map((issue) => (
        <SingleIssue
          issue={issue}
          key={issue._id}
          href={`${slug}/${issue.slug}`}
        />
      ));
  };

  useEffect(() => {
    setIssuesDOM(getFilteredIssues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, sliceCount, slug, issues]);

  const loadMoreIssues = () => {
    setSliceCount(sliceCount + 8);
  };

  const applyFilter = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <h2 className="self-center text-xl">Issues</h2>
        <input
          type="text"
          placeholder="Search for issue"
          className="p-2 rounded-lg focus:outline-none ring-2 ring-neutral-800 focus:ring-blue-600"
          onChange={(e) => applyFilter(e)}
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {issuesDOM}
        {/* Render load more button if we have more issues */}
        {getFilteredIssues().length >= sliceCount && (
          <button className="group relative" onClick={loadMoreIssues}>
            <Image
              unoptimized
              className="rounded-lg group-hover:brightness-[0.35]"
              src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNU/Q8AAU8BJijqIsEAAAAASUVORK5CYII="
              layout="responsive"
              width={1}
              height={1.3}
              alt="load more issues"
            />
            <p className="absolute top-1/2 left-1/2 text-lg text-white transition duration-100 group-hover:scale-125 -translate-x-1/2 -translate-y-1/2">
              Load More
            </p>
          </button>
        )}
      </div>
    </div>
  );
};

export { IssueList };
