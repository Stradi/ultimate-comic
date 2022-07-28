import { SEO } from 'configs/seo';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Container } from '../Container';
import { INavbarItemProps, NavbarItem } from './NavbarItem';

interface INavbarProps {
  items: INavbarItemProps[];
}

const Navbar = ({ items }: INavbarProps) => {
  const rightSideDOM = items.map((item) => (
    <NavbarItem text={item.text} href={item.href} key={item.text} />
  ));

  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <nav className="py-2.5 px-2 bg-neutral-900 rounded sm:px-4">
      <Container>
        <div className="flex flex-wrap justify-between items-center mx-auto">
          <Link href="/">
            <a className="group flex relative gap-2 items-center py-2 px-4 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100">
              <Image
                src="/brand/logo_dark_2x.png"
                className="h-6 group-hover:brightness-125 transition duration-100 sm:h-9"
                alt="UltimateComic Logo"
                width={51.2}
                height={40.25}
              />
              <span className="relative self-center font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-100 -translate-x-1/3 group-hover:translate-x-0">
                {SEO.WEBSITE_NAME}
              </span>
            </a>
          </Link>
          <div className="flex">
            <button
              data-collapse-toggle="navbar-search"
              type="button"
              className="inline-flex items-center p-2 text-sm text-neutral-500 hover:text-neutral-400 hover:bg-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 md:hidden"
              aria-controls="navbar-search"
              aria-expanded="true"
              onClick={() => {
                setNavbarOpen(!navbarOpen);
              }}
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="w-6 h-6"
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
            className={`justify-between items-center w-full md:flex md:order-1 md:w-auto ${
              navbarOpen ? '' : 'hidden'
            }`}
          >
            <ul className="flex flex-col mt-4 md:flex-row md:mt-0 md:space-x-2 md:text-sm md:font-medium">
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
