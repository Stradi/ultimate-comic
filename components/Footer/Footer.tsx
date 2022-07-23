import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="flex justify-center items-center py-2 bg-black">
      <p className="text-xs text-neutral-600">
        Copyright and trademarks for comic(s) and promotional materials are held
        by their respective owners and their use is allowed under the fair use
        clause of{' '}
        <a
          href="https://www.copyright.gov/title17/"
          className="text-neutral-400 hover:text-red-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          Copyright Law
        </a>
        .<br></br>
        For more information see{' '}
        <Link href="/privacy-policy">
          <a className="text-neutral-400 hover:text-red-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600">
            Privacy Policy
          </a>
        </Link>{' '}
        and{' '}
        <Link href="/dmca">
          <a className="text-neutral-400 hover:text-red-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-600">
            DMCA
          </a>
        </Link>
        .
      </p>
    </footer>
  );
};

export { Footer };
