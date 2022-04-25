import Image from 'next/image';
import Link from 'next/link';
import { IIssueDocument } from '../../lib/database/models';
import { toHumanReadable } from '../../lib/utils/date';

interface ISingleIssueProps {
  issue: IIssueDocument;
  href: string;
}

const SingleIssue = ({ issue, href }: ISingleIssueProps) => {
  const images = issue.images as string[];
  const coverImage = images[0];
  return (
    <Link href={href} passHref>
      <a className="group relative rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100">
        <Image
          className="rounded-lg group-hover:brightness-[0.2] transition duration-100"
          src={coverImage}
          layout="responsive"
          width={1}
          height={1.3}
          alt={issue.name}
        />
        <div className="px-4 text-white opacity-0 group-hover:opacity-100 transition duration-100">
          <p className="absolute top-0 transition duration-100 group-hover:translate-y-14">
            <span className="font-medium">Released at:</span>
            <br></br>
            <span className="text-sm">{toHumanReadable(issue.createdAt)}</span>
          </p>
        </div>
        <p className="absolute top-0 py-2 px-4 w-full font-medium text-white bg-black/90 group-hover:bg-black rounded-t-md transition duration-100">
          {issue.name}
        </p>
      </a>
    </Link>
  );
};

export { SingleIssue };
