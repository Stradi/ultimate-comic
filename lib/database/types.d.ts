import { IComicDocument } from './models';

type PopulationOption = {
  fieldName: string;
  fields: string;
};

type SortOption = {
  [key in keyof IComicDocument]?: 'descending' | 'ascending';
};
