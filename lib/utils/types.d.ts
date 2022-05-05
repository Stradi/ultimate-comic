type BlogPost = {
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  seo: {
    description: string;
  };
};
