import { SEO } from 'configs/seo';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Container } from '../Container';
import { INavbarItemProps, NavbarItem } from './NavbarItem';

interface INavbarProps {
  items: INavbarItemProps[];
}

const Navbar = ({ items }: INavbarProps) => {
  const router = useRouter();

  const rightSideDOM = items.map((item) => (
    <NavbarItem text={item.text} href={item.href} key={item.text} />
  ));

  const [navbarOpen, setNavbarOpen] = useState(false);

  const handleBrandClick = (e: React.MouseEvent) => {
    if (e.type === 'contextmenu') {
      e.preventDefault();
      router.push('/design');
    }
  };

  return (
    <nav className="rounded bg-neutral-900 py-2.5 px-2 sm:px-4">
      <Container>
        <div className="mx-auto flex flex-wrap items-center justify-between">
          <Link href="/">
            <a
              onClick={handleBrandClick}
              onContextMenu={handleBrandClick}
              className="group relative flex items-center gap-2 rounded-md py-2 px-4 text-neutral-400 transition duration-100 hover:bg-neutral-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <Image
                src="/brand/logo_dark_2x.png"
                className="h-6 transition duration-100 group-hover:brightness-125 sm:h-9"
                alt="UltimateComic Logo"
                width={51.2}
                height={40.25}
              />
              <span className="relative -translate-x-1/3 self-center whitespace-nowrap font-semibold opacity-0 transition duration-100 group-hover:translate-x-0 group-hover:opacity-100">
                {SEO.WEBSITE_NAME}
              </span>
            </a>
          </Link>
          <div className="flex">
            <button
              data-collapse-toggle="navbar-search"
              type="button"
              className="inline-flex items-center rounded-lg p-2 text-sm text-neutral-500 hover:bg-neutral-800 hover:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-600 md:hidden"
              aria-controls="navbar-search"
              aria-expanded="true"
              onClick={() => {
                setNavbarOpen(!navbarOpen);
              }}
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-6 w-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className={`w-full items-center justify-between md:order-1 md:flex md:w-auto ${
              navbarOpen ? '' : 'hidden'
            }`}
          >
            <ul className="mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-2 md:text-sm md:font-medium">
              {rightSideDOM}
            </ul>
          </div>
        </div>
      </Container>
    </nav>

    // {/* <nav className="mx-auto w-full sm:flex sm:justify-between sm:h-16 md:w-9/12">
    //   <ul className="flex gap-2 justify-evenly self-center">{leftSideDOM}</ul>
    //   <ul className="flex gap-2 justify-evenly self-center">
    //     {rightSideDOM}
    //   </ul>
    // </nav> */}
  );
};

export type { INavbarProps };
export { Navbar };
