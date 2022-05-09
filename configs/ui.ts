const PAGES = {
  ALL_COMICS: {
    COMIC_PER_PAGE: process.env.NODE_ENV === 'development' ? 20 : 100,
  },
  TAG: {
    COMIC_PER_PAGE: process.env.NODE_ENV === 'development' ? 20 : 100,
    GENERATE_ON_BUILD: process.env.NODE_ENV === 'development' ? 10 : 50,
  },
  COMIC: {
    GENERATE_ON_BUILD: process.env.NODE_ENV === 'development' ? 10 : 50,
  },
};

export { PAGES };
