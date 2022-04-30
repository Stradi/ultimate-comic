import Link from 'next/link';
import { IComicDocument } from '~/lib/database/models';

interface ISingleComic {
  comic: IComicDocument;
  addViewCount?: boolean;
}

const SingleComic = ({ comic, addViewCount }: ISingleComic) => {
  return (
    <Link href={`/comic/${comic.slug}`}>
      <a className="group block relative p-2 my-1 truncate bg-neutral-900 hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100 sm:my-0">
        {comic.isCompleted ? (
          // eslint-disable-next-line tailwindcss/no-custom-classname
          <i className="group-hover:text-green-500 align-middle transition duration-100 ri-check-line ri-fw" />
        ) : (
          // eslint-disable-next-line tailwindcss/no-custom-classname
          <i className="group-hover:text-red-500 align-middle transition duration-100 ri-close-line ri-fw" />
        )}
        <span className="ml-1 text-sm group-hover:text-white align-middle transition duration-100">
          {comic.name}
        </span>
        {addViewCount && (
          <div className=" absolute top-1/2 left-0 w-full h-full bg-black/90 opacity-0 group-hover:opacity-100 transition duration-100 -translate-y-1/2">
            <span className="absolute top-1/2 left-1/2 text-sm -translate-x-1/2 -translate-y-1/2">
              Total Views:{' '}
              <span className="font-medium text-red-600">
                {comic.totalViews || 0}
              </span>
            </span>
          </div>
        )}
      </a>
    </Link>
  );
};

export { SingleComic };
