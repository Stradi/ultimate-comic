import { CookieConsent } from '../CookieConsent';
import { Footer } from '../Footer';
import { INavbarProps, Navbar } from '../Navbar';

interface ILayoutProps {
  children?: React.ReactNode;
}
const Layout = ({ children }: ILayoutProps) => {
  const navbarItems: INavbarProps = {
    items: [
      {
        text: 'Search',
        href: '/search',
      },
      {
        text: 'All Comics',
        href: '/all-comics/0',
      },
      {
        text: 'Popular Comics',
        href: '/popular-comics',
      },
      {
        text: 'All Genres',
        href: '/genres',
      },
      {
        text: 'Articles',
        href: '/blog',
      },
      {
        text: 'Guides',
        href: '/guides',
      },
    ],
  };
  return (
    <div className="flex min-h-screen flex-col">
      <CookieConsent />
      <Navbar items={navbarItems.items} />
      <br></br>
      <main className="flex-1">{children}</main>
      <br></br>
      <Footer />
    </div>
  );
};

export { Layout };
