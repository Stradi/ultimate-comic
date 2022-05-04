import Link from 'next/link';
import { ITagDocument } from '~/lib/database/models';

interface ISingleTagProps {
  tag: ITagDocument;
}

const SingleTag = ({ tag }: ISingleTagProps) => {
  return (
    <Link href={`/tag/${tag.slug}`}>
      <a className="group block relative p-2 my-1 truncate bg-neutral-900 hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100 sm:my-0">
        <span className="text-sm group-hover:text-white transition duration-100">
          {tag.name}
        </span>
      </a>
    </Link>
  );
};

export { SingleTag };
