import { Footer } from '../Footer';
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
        href: '/all-comics/0',
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
      <br></br>
      <Footer />
    </>
  );
};

export { Layout };
