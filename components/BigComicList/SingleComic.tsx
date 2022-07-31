import Image from 'next/image';
import Link from 'next/link';
import { IComicDocument } from '~/lib/database/models';
import { toHumanReadable } from '~/lib/utils/date';

interface ISingleComicProps {
  comic: IComicDocument;
}

const SingleComic = ({ comic }: ISingleComicProps) => {
  return (
    <Link href={`/comic/${comic.slug}`} prefetch={false}>
      <a className="group relative rounded-md transition duration-100 focus:outline-none focus:ring-2 focus:ring-red-600">
        <Image
          className="rounded-lg transition duration-100 group-hover:brightness-[0.2]"
          src={comic.coverImage as string}
          layout="responsive"
          width={1}
          height={1.3}
          sizes={'(max-width: 640px) 30vw, 20vw'}
          alt={comic.name}
        />
        <div className="px-4 text-white opacity-0 transition duration-100 group-hover:opacity-100">
          <p className="absolute top-0 transition duration-100 group-hover:translate-y-16">
            <span className="font-medium">Released at:</span>
            <br></br>
            <span className="text-sm">
              {toHumanReadable(comic.releaseDate as Date)}
            </span>
            <br></br>
            <span className="font-medium">Views:</span>
            <br></br>
            <span className="text-sm">{comic.totalViews} views</span>
            <br></br>
            <span className="font-medium">Issue Count:</span>
            <br></br>
            <span className="text-sm">{comic.issues?.length} issues</span>
          </p>
        </div>
        <p className="absolute top-0 w-full rounded-t-md bg-black/90 py-2 px-4 font-medium text-white transition duration-100 line-clamp-2 group-hover:bg-black">
          {comic.name}
        </p>
      </a>
    </Link>
  );
};

export { SingleComic };
