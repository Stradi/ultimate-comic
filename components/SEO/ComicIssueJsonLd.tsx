import Head from 'next/head';

interface IComicIssueJsonLdProps {
  issueNumber: string;
  pageStart: number;
  pageEnd: number;
}

const ComicIssueJsonLd = ({
  issueNumber,
  pageStart,
  pageEnd,
}: IComicIssueJsonLdProps) => {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
            "@context":"http://schema.org",
            "@type":"ComicIssue",
            "issueNumber":"${issueNumber}",
            "pageStart":${pageStart},
            "pageEnd":${pageEnd},
            "pagination":"${pageStart}-${pageEnd}"
          }`.replace(/ {2}|\r\n|\n|\r/gm, ''),
        }}
      />
    </Head>
  );
};
export { ComicIssueJsonLd };
