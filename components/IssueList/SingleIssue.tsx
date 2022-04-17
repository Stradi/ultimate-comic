import Image from 'next/image';
import Link from 'next/link';
import { IIssueDocument } from '../../lib/database/models';
import { toHumanReadable } from '../../lib/utils/date';

interface ISingleIssueProps {
  issue: IIssueDocument;
  href: string;
}

const SingleIssue = ({ issue, href }: ISingleIssueProps) => {
  return (
    <Link href={href} passHref>
      <a className="group relative">
        <Image
          className="rounded-lg group-hover:brightness-[0.35] transition duration-100"
          src={issue.images[0]}
          layout="responsive"
          width={1}
          height={1.3}
          alt={issue.name}
        />
        <p className="absolute top-0 px-4 w-full text-lg text-white bg-black/80 rounded-t-md">
          {issue.name}
        </p>
        <div className="px-4 text-white opacity-0 group-hover:opacity-100 transition duration-100">
          <p className="absolute top-0 transition duration-100 group-hover:translate-y-8">
            Released at:<br></br>
            {toHumanReadable(issue.createdAt)}
          </p>
          <p className="absolute bottom-0 transition duration-100 group-hover:-translate-y-2">
            {issue.images?.length} pages
          </p>
        </div>
      </a>
    </Link>
  );
};

export { SingleIssue };
