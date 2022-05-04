import Link from 'next/link';
import { IComicDocument, ITagDocument } from '~/lib/database/models';

interface ISingleTagProps {
  tag: ITagDocument;
}

const SingleTag = ({ tag }: ISingleTagProps) => {
  const comics = tag.comics as IComicDocument[];
  return (
    <Link href={`/tag/${tag.slug}`}>
      <a className="group block relative p-2 my-1 truncate bg-neutral-900 hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100 sm:my-0">
        <span className="text-sm group-hover:text-white transition duration-100">
          {tag.name}
        </span>
        <div className="absolute top-1/2 left-0 w-full h-full bg-black/90 opacity-0 group-hover:opacity-100 transition duration-100 -translate-y-1/2">
          <span className="absolute top-1/2 left-1/2 text-sm -translate-x-1/2 -translate-y-1/2">
            Comic Count:{' '}
            <span className="font-medium text-red-600">{comics.length}</span>
          </span>
        </div>
      </a>
    </Link>
  );
};

export { SingleTag };
