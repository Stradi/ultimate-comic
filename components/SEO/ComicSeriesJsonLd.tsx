import Head from 'next/head';

interface IComicSeriesJsonLd {
  name: string;
  description: string;
  startDate: number;
}

const ComicSeriesJsonLd = ({
  name,
  description,
  startDate,
}: IComicSeriesJsonLd) => {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
            "@context":"http://schema.org",
            "@type":"ComicSeries",
            "name":"${name}",
            "description":"${description}",
            "startDate":${startDate}
          }`.replace(/ {2}|\r\n|\n|\r/gm, ''),
        }}
      />
    </Head>
  );
};

export { ComicSeriesJsonLd };
