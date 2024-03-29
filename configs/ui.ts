const PAGES = {
  ALL_COMICS: {
    COMIC_PER_PAGE: process.env.NODE_ENV === 'development' ? 20 : 50,
  },
  TAG: {
    COMIC_PER_PAGE: process.env.NODE_ENV === 'development' ? 20 : 50,
    GENERATE_ON_BUILD: process.env.NODE_ENV === 'development' ? 10 : 50,
  },
  COMIC: {
    GENERATE_ON_BUILD: process.env.NODE_ENV === 'development' ? 10 : 50,
  },
};

const IMAGE = {
  SIZES: {
    SMALL: 400,
    MEDIUM: 700,
    LARGE: 1600,
    FULL: 0,
  },
};
export { PAGES, IMAGE };
