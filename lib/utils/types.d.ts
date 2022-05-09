type BlogPost = {
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  seo: {
    description: string;
  };
  publishedAt: Date;
  updatedAt: Date;
};

type StaticPage = {
  title: string;
  slug: string;
  content: string;
  publishedAt: Date;
  updatedAt: Date;
};
