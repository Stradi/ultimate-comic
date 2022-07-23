const WEBSITE_NAME = 'UltimateComic';
const URL =
  process.env.NODE_ENV === 'development'
    ? 'localhost:3000'
    : 'www.ultimatecomic.com';
const HEAD = {
  TITLE: `Read Online Comics, for Free`,
  TITLE_TEMPLATE: `%s | ${WEBSITE_NAME}`,
  META: {
    KEYWORDS: [
      'read online comics',
      'read free comics',
      'read high quality comics',
      'free comics',
      'comic books',
      'comic viewer',
      'free comic book',
      'comic online',
      'ultimatecomic',
      'ultimate comic',
    ],
    DESCRIPTION:
      'Read comics online in high quality. Thousands of comics awaiting you. Biggest comic database for Marvel, DC Comics, Dark Horse Comics, Valiant Comics and more.',
  },
  SOCIAL: {
    TWITTER: {
      HANDLE: '@ultimatecomic',
      SITE: '@ultimatecomic',
      CARD_TYPE: 'summary_large_image',
    },
  },
};

const SEO = { WEBSITE_NAME, URL, HEAD };

export { SEO };
