import Link from 'next/link';

interface INavbarItemProps {
  text: string;
  href: string;
}

const NavbarItem = ({ text, href }: INavbarItemProps) => {
  return (
    <Link
      href={href}
      passHref
      prefetch={false}
      className="rounded-md px-4 py-2 text-neutral-400 transition duration-100 hover:bg-neutral-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-600"
    >
      {text}
    </Link>
  );
};

export type { INavbarItemProps };
export { NavbarItem };
