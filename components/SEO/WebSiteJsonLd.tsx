import Head from 'next/head';

interface IWebsiteJsonLdProps {
  name: string;
  url: string;
}

const WebSiteJsonLd = ({ name, url }: IWebsiteJsonLdProps) => {
  const data = {
    name,
    url,
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
            "@context":"http://schema.org",
            "@type":"WebSite",
            "url":"${data.url}",
            "name":"${data.name}"
          }`.replace(/ {2}|\r\n|\n|\r/gm, ''),
        }}
      />
    </Head>
  );
};

export { WebSiteJsonLd };
