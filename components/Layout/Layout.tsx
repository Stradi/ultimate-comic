import { INavbarProps, Navbar } from '../Navbar';

interface ILayoutProps {
  children?: React.ReactNode;
}
const Layout = ({ children }: ILayoutProps) => {
  const navbarItems: INavbarProps = {
    left: [
      {
        text: 'Comix',
        href: '/',
      },
    ],
    right: [
      {
        text: 'All Comics',
        href: '/all-comics',
      },
      {
        text: 'Popular Comics',
        href: '/popular-comics',
      },
      {
        text: 'Latest Comics',
        href: '/latest-comics',
      },
    ],
  };
  return (
    <>
      <Navbar left={navbarItems.left} right={navbarItems.right} />
      <br></br>
      {children}
    </>
  );
};

export { Layout };
