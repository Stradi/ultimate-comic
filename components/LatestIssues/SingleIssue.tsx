import Image from 'next/image';
import Link from 'next/link';
import { IIssueDocument } from '~/lib/database/models';
import { toHumanReadable } from '~/lib/utils/date';

interface ISingleIssueProps {
  issue: IIssueDocument;
}

const SingleIssue = ({ issue }: ISingleIssueProps) => {
  const coverImage = (issue.images as string[])[0];
  return (
    <Link href={`/comic/${issue.comic.slug}/${issue.slug}`}>
      <a className="group flex mb-2 bg-neutral-900 hover:bg-neutral-800 rounded-md transition duration-100 sm:mb-0">
        <div className="mr-2 w-1/2">
          <Image
            className="rounded-l-md"
            src={coverImage}
            layout="responsive"
            width={1}
            height={1.3}
            alt={issue.name}
            objectFit="fill"
          />
        </div>
        <div className="flex flex-col justify-between py-2 w-1/2">
          <div>
            <p className="font-medium group-hover:text-white">
              {issue.comic.name}
            </p>
            <p className="group-hover:text-white">{issue.name}</p>
          </div>
          <p className="text-sm">{toHumanReadable(issue.createdAt as Date)}</p>
        </div>
      </a>
    </Link>
  );
};

export { SingleIssue };