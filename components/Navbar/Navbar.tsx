import { INavbarItemProps, NavbarItem } from './NavbarItem';

interface INavbarProps {
  left: INavbarItemProps[];
  right: INavbarItemProps[];
}

const Navbar = ({ left, right }: INavbarProps) => {
  const leftSideDOM = left.map((item) => (
    <NavbarItem text={item.text} href={item.href} key={item.text} />
  ));
  const rightSideDOM = right.map((item) => (
    <NavbarItem text={item.text} href={item.href} key={item.text} />
  ));

  return (
    <div className="bg-neutral-900">
      <nav className="mx-auto w-full sm:flex sm:justify-between sm:h-16 md:w-9/12">
        <ul className="flex gap-2 justify-evenly self-center">{leftSideDOM}</ul>
        <ul className="flex gap-2 justify-evenly self-center">
          {rightSideDOM}
        </ul>
      </nav>
    </div>
  );
};

export type { INavbarProps };
export { Navbar };
