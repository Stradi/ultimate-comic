import { ChangeEventHandler } from 'react';
import { Button } from '../Button';

interface ISearchInputProps {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  initialValue?: string;
  displayButton?: boolean;
  buttonHref?: string;
  buttonText?: string;
  buttonType?: 'minimal' | 'default';
}

const SearchInput = ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange,
  initialValue,
  displayButton = false,
  buttonHref = '',
  buttonText = 'Search',
  buttonType = 'default',
}: ISearchInputProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-center my-8 mx-auto w-full h-full">
        <div className="flex relative w-full md:w-1/3">
          <input
            type={'text'}
            className="absolute top-0 left-0 p-2 pl-9 w-full placeholder:font-medium placeholder:text-neutral-700 text-neutral-300 focus:placeholder:text-neutral-500 bg-neutral-800 rounded-md focus:outline-none ring-2 ring-neutral-700 focus:ring-red-600 transition duration-100"
            placeholder="Search..."
            onChange={onChange || undefined}
            defaultValue={initialValue && initialValue}
          />
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          <i className="z-10 py-3 px-2 font-medium text-neutral-500 ri-search-line ri-lg" />
        </div>
        {displayButton && (
          <Button
            href={buttonHref}
            text={buttonText}
            type={buttonType}
            className="ml-2"
          />
        )}
      </div>
    </div>
  );
};

export { SearchInput };
