import Link from 'next/link';
import { toHumanReadable } from '~/lib/utils/date';

interface ISinglePostProps {
  post: BlogPost;
}

const SinglePost = ({ post }: ISinglePostProps) => {
  return (
    <Link href={`/blog/${post.slug}`}>
      <a className="group mb-2 block rounded-md bg-neutral-900 py-2 px-3 transition duration-100 hover:bg-neutral-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600">
        <div className="flex justify-between">
          <p className="relative transition duration-100 group-hover:translate-x-4 group-focus:translate-x-4">
            <span className="mr-2 -ml-4 opacity-0 transition duration-100 group-hover:opacity-100 group-focus:opacity-100">
              {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
              <i className="ri-arrow-right-s-line ri-fw align-middle text-green-500" />
            </span>
            <span className="align-text-top">{post.title}</span>
          </p>
          <p>{toHumanReadable(post.publishedAt)}</p>
        </div>
      </a>
    </Link>
  );
};

export { SinglePost };
