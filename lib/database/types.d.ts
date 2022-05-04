type PopulationOption = {
  fieldName: string;
  fields: string;
};

type SortOption<T> = {
  [key in keyof T]?: 'descending' | 'ascending';
};
