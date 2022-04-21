import Link from 'next/link';

interface INavbarItemProps {
  text: string;
  href: string;
}

const NavbarItem = ({ text, href }: INavbarItemProps) => {
  return (
    <Link href={href} passHref>
      <a className="py-2 px-4 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition duration-100">
        {text}
      </a>
    </Link>
  );
};

export type { INavbarItemProps };
export { NavbarItem };
