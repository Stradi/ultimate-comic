import Link from 'next/link';
import { ITagDocument } from '~/lib/database/models';

interface ISingleTagProps {
  tag: ITagDocument;
}

const SingleTag = ({ tag }: ISingleTagProps) => {
  return (
    <Link href={`/tag/${tag.slug}`} prefetch={false}>
      <a className="group relative my-1 block truncate rounded-md bg-neutral-900 p-2 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600 sm:my-0">
        <span className="text-sm transition duration-100 group-hover:text-white">
          {tag.name}
        </span>
      </a>
    </Link>
  );
};

export { SingleTag };
