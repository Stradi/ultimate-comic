import mongoose from 'mongoose';
import { AuthorSchema, IAuthorDocument } from './Author';
import { ComicSchema, IComicDocument } from './Comic';
import { IIssueDocument, IssueSchema } from './Issue';
import { ITagDocument, TagSchema } from './Tag';

const loadModel = <T>(name: string, schema: mongoose.Schema) => {
  return mongoose.models[name]
    ? mongoose.model<T>(name)
    : mongoose.model<T>(name, schema);
};

const ComicModel = loadModel<IComicDocument>('Comic', ComicSchema);
const IssueModel = loadModel<IIssueDocument>('Issue', IssueSchema);
const AuthorModel = loadModel<IAuthorDocument>('Author', AuthorSchema);
const TagModel = loadModel<ITagDocument>('Tag', TagSchema);

export {
  ComicModel,
  ComicSchema,
  IssueModel,
  IssueSchema,
  AuthorModel,
  AuthorSchema,
  TagModel,
  TagSchema,
};
export type { IComicDocument, IIssueDocument, IAuthorDocument, ITagDocument };
