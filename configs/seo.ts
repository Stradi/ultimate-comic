const WEBSITE_NAME = 'Read Comix';
const URL =
  process.env.NODE_ENV === 'development' ? 'localhost:3000' : 'example.com';
const HEAD = {
  TITLE: `Read Online Comics for Free`,
  TITLE_TEMPLATE: `%s | ${WEBSITE_NAME}`,
  META: {
    KEYWORDS: [
      'read online comics',
      'read free comics',
      'free comics',
      'comic books',
      'comic viewer',
      'free comic book',
      'comic online',
    ],
    DESCRIPTION:
      'Read online comics for free. Biggest comics database for Marvel, DC Comics, Dark Horse Comics and more. Read Marvel, DC Comics, Dark Horse Comics for free.',
  },
  SOCIAL: {
    TWITTER: {
      HANDLE: '@handle',
      SITE: '@site',
      CARD_TYPE: 'summary_large_image',
    },
  },
};

const SEO = { WEBSITE_NAME, URL, HEAD };

export { SEO };
