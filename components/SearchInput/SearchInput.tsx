import { ChangeEventHandler } from 'react';

interface ISearchInputProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const SearchInput = ({ onChange }: ISearchInputProps) => {
  return (
    <div className="flex relative items-center my-8 mx-auto w-1/3 h-full">
      <input
        type={'text'}
        className="absolute top-0 left-0 p-2 pl-9 w-full placeholder:font-medium placeholder:text-neutral-700 text-neutral-300 focus:placeholder:text-neutral-500 bg-neutral-800 rounded-md focus:outline-none ring-2 ring-neutral-700 focus:ring-red-600 transition duration-100"
        placeholder="Search..."
        onChange={onChange}
      />
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <i className="z-10 py-3 px-2 font-medium text-neutral-500 ri-search-line ri-lg" />
    </div>
  );
};

export { SearchInput };
