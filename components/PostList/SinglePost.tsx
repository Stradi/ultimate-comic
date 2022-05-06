import Link from 'next/link';
import { toHumanReadable } from '~/lib/utils/date';

interface ISinglePostProps {
  post: BlogPost;
}

const SinglePost = ({ post }: ISinglePostProps) => {
  return (
    <Link href={`/blog/${post.slug}`}>
      <a className="group block py-2 px-3 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100">
        <div className="flex justify-between">
          <p className="relative transition duration-100 group-hover:translate-x-4 group-focus:translate-x-4">
            <span className="mr-2 -ml-4 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition duration-100">
              {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
              <i className="text-green-500 align-middle ri-arrow-right-s-line ri-fw" />
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
