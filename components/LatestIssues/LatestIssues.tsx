import { IIssueDocument } from '~/lib/database/models';
import { SingleIssue } from './SingleIssue';

interface ILatestIssuesProps {
  issues: IIssueDocument[];
  title?: string;
}

const LatestIssues = ({ issues, title }: ILatestIssuesProps) => {
  const issuesDOM = issues.map((issue) => (
    <SingleIssue issue={issue} key={issue._id} />
  ));
  return (
    <div>
      <h2 className="text-lg font-medium text-white">{title}</h2>
      <div className="sm:grid sm:grid-cols-2 sm:gap-2 md:grid-cols-2">
        {issuesDOM}
      </div>
    </div>
  );
};

export { LatestIssues };
