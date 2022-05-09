import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'remixicon/fonts/remixicon.css';
import { Layout } from '~/components/Layout';
import { WebSiteJsonLd } from '~/components/SEO/WebSiteJsonLd';
import { SEO } from '../configs/seo';
import '../styles/globals.css';

//TODO: Add image for website.
function MyApp({ Component, pageProps }: AppProps) {
  Router.events.on('routeChangeStart', () => NProgress.start());
  Router.events.on('routeChangeComplete', () => NProgress.done());
  Router.events.on('routeChangeError', () => NProgress.done());

  return (
    <>
      <DefaultSeo
        titleTemplate={SEO.HEAD.TITLE_TEMPLATE}
        title={SEO.HEAD.TITLE}
        defaultTitle={SEO.HEAD.TITLE}
        description={SEO.HEAD.META.DESCRIPTION}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: SEO.HEAD.META.KEYWORDS.join(','),
          },
        ]}
        openGraph={{
          title: SEO.HEAD.TITLE,
          site_name: SEO.WEBSITE_NAME,
          url: SEO.URL,
          type: 'website',
        }}
        twitter={{
          handle: SEO.HEAD.SOCIAL.TWITTER.HANDLE,
          site: SEO.HEAD.SOCIAL.TWITTER.SITE,
          cardType: SEO.HEAD.SOCIAL.TWITTER.CARD_TYPE,
        }}
      />
      <WebSiteJsonLd name={SEO.WEBSITE_NAME} url={SEO.URL} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
