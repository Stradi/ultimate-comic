import Link from 'next/link';
import { IComicDocument } from '~/lib/database/models';

interface ISingleComic {
  comic: IComicDocument;
  addViewCount?: boolean;
}

const SingleComic = ({ comic, addViewCount }: ISingleComic) => {
  return (
    <Link href={`/comic/${comic.slug}`}>
      <a className="group relative my-1 block truncate rounded-md bg-neutral-900 p-2 transition duration-100 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-600 sm:my-0">
        {comic.isCompleted ? (
          // eslint-disable-next-line tailwindcss/no-custom-classname
          <i className="ri-check-line ri-fw align-middle transition duration-100 group-hover:text-green-500" />
        ) : (
          // eslint-disable-next-line tailwindcss/no-custom-classname
          <i className="ri-close-line ri-fw align-middle transition duration-100 group-hover:text-red-500" />
        )}
        <span className="ml-1 align-middle text-sm transition duration-100 group-hover:text-white">
          {comic.name}
        </span>
        {addViewCount && (
          <div className=" absolute top-1/2 left-0 h-full w-full -translate-y-1/2 bg-black/90 opacity-0 transition duration-100 group-hover:opacity-100">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">
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
