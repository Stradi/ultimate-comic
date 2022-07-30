type BlogPost = {
  title: string;
  slug: string;
  content: MDXRemoteSerializeResult;
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
  content: MDXRemoteSerializeResult;
  publishedAt: Date;
  updatedAt: Date;
};

type GuidePage = {
  title: string;
  slug: string;
  content: MDXRemoteSerializeResult;
  coverImage: string;
  seo: {
    description: string;
  };
  publishedAt: Date;
  updatedAt: Date;
};
