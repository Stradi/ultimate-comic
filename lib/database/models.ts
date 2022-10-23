export interface IMeta {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IComic extends IMeta {
  name: string;
  slug: string;
  isCompleted: boolean;
  releaseDate: Date;
  summary: string;
  coverImage: string;
  issues: Partial<IIssue[]>;
  tags: Partial<ITag[]>;
  authors: Partial<IAuthor[]>;
}

export interface IIssue extends IMeta {
  name: string;
  slug: string;
  comic: IComic;
  images: string[];
}

export interface ITag extends IMeta {
  name: string;
  slug: string;
  comics: Partial<IComic>[];
}

export interface IAuthor extends IMeta {
  name: string;
  slug: string;
  comics: Partial<IComic>[];
}
