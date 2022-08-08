import Image from 'next/image';
import Link from 'next/link';
import { IIssueDocument } from '../../lib/database/models';
import { toHumanReadable } from '../../lib/utils/date';

interface ISingleIssueProps {
  issue: IIssueDocument;
  href: string;
  isBig?: boolean;
}

//TODO: Refactor
const MiniSingleIssue = ({ issue, href }: ISingleIssueProps) => {
  return (
    <Link href={href} prefetch={false}>
      <a className="truncate rounded-md bg-neutral-900 p-2 transition duration-100 hover:bg-neutral-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600">
        {issue.name}
      </a>
    </Link>
  );
};

const BigSingleIssue = ({ issue, href }: ISingleIssueProps) => {
  const images = issue.images as string[];
  let coverImage =
    'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNU/Q8AAU8BJijqIsEAAAAASUVORK5CYII=';
  if (images) {
    coverImage = images[0];
  }

  return (
    <Link href={href} passHref prefetch={false}>
      <a className="group relative rounded-md transition duration-100 focus:outline-none focus:ring-2 focus:ring-red-600">
        <Image
          className="rounded-lg transition duration-100 group-hover:brightness-[0.2]"
          src={coverImage}
          layout="responsive"
          width={1}
          height={1.3}
          sizes={'(max-width: 640px) 50vw, 25vw'}
          alt={issue.name}
        />
        <div className="px-4 text-white opacity-0 transition duration-100 group-hover:opacity-100">
          <p className="absolute top-0 transition duration-100 group-hover:translate-y-14">
            <span className="font-medium">Released at:</span>
            <br></br>
            <span className="text-sm">{toHumanReadable(issue.createdAt)}</span>
          </p>
        </div>
        <p className="absolute top-0 w-full rounded-t-md bg-black/90 py-2 px-4 font-medium text-white transition duration-100 group-hover:bg-black">
          {issue.name}
        </p>
      </a>
    </Link>
  );
};

const SingleIssue = ({ isBig, issue, href }: ISingleIssueProps) => {
  if (isBig) return <BigSingleIssue issue={issue} href={href} />;
  else return <MiniSingleIssue issue={issue} href={href} />;
};

export { SingleIssue };
