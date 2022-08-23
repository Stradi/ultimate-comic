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
  excerpt: string;
  publishedAt: Date;
  updatedAt: Date;
  metadata: GuideMetadata;
};

type GuideMetadata = Partial<CharacterGuideMetadata>;

type CharacterGuideMetadata = {
  superName: string;
  realName: string;
  aliases: string[];
  publisher: string;
  creators: string[];
  gender: string;
  birthday: string;
  died: string;
  related: string[];
};
