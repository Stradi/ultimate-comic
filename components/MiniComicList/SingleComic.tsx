import Link from 'next/link';
import { IComicDocument } from '~/lib/database/models';

interface ISingleComic {
  comic: IComicDocument;
}

const SingleComic = ({ comic }: ISingleComic) => {
  return (
    <Link href={`/comic/${comic.slug}`}>
      <a className="group block p-2 my-1 truncate bg-neutral-900 hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100 sm:my-0">
        {comic.isCompleted ? (
          // eslint-disable-next-line tailwindcss/no-custom-classname
          <i className="group-hover:text-green-500 align-middle transition duration-100 ri-check-line ri-fw" />
        ) : (
          // eslint-disable-next-line tailwindcss/no-custom-classname
          <i className="group-hover:text-red-500 align-middle transition duration-100 ri-close-line ri-fw" />
        )}
        {/* <span className="mx-1 text-neutral-500 group-hover:text-neutral-400 transition duration-100">
          |
        </span> */}
        <span className="ml-1 text-sm group-hover:text-white align-middle transition duration-100">
          {comic.name}
        </span>
      </a>
    </Link>
  );
};

export { SingleComic };
