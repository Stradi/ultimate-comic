import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="flex items-center justify-center bg-black py-2">
      <p className="text-xs text-neutral-600">
        Copyright and trademarks for comic(s) and promotional materials are held
        by their respective owners and their use is allowed under the fair use
        clause of{' '}
        <a
          href="https://www.copyright.gov/title17/"
          className="rounded-sm text-neutral-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          Copyright Law
        </a>
        .<br></br>
        For more information see{' '}
        <Link
          href="/privacy-policy"
          className="rounded-sm text-neutral-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          Privacy Policy
        </Link>{' '}
        and{' '}
        <Link
          href="/dmca"
          className="rounded-sm text-neutral-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          DMCA
        </Link>
        .
      </p>
    </footer>
  );
};

export { Footer };
