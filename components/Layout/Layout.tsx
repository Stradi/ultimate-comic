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
    <div className="flex flex-col min-h-screen">
      <Navbar left={navbarItems.left} right={navbarItems.right} />
      <br></br>
      <main className="flex-1">{children}</main>
      <br></br>
      <Footer />
    </div>
  );
};

export { Layout };
