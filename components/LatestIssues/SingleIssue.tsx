import Image from 'next/image';
import Link from 'next/link';
import { IComicDocument, IIssueDocument } from '~/lib/database/models';
import { toHumanReadable } from '~/lib/utils/date';

interface ISingleIssueProps {
  issue: IIssueDocument;
}

const SingleIssue = ({ issue }: ISingleIssueProps) => {
  const coverImage = (issue.images as string[])[0];
  const comic = issue.comic as IComicDocument;
  return (
    <Link href={`/comic/${comic.slug}/${issue.slug}`} prefetch={false}>
      <a className="group mb-2 flex rounded-md bg-neutral-900 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600 sm:mb-0">
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
        <div className="flex w-1/2 flex-col justify-between py-2">
          <div>
            <p className="font-medium group-hover:text-white md:line-clamp-2">
              {comic.name}
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
