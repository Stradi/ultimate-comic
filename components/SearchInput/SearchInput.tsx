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
      <div className="flex h-full w-full">
        <div className="relative flex w-full">
          <input
            type={'text'}
            className="absolute left-0 top-0 w-full rounded-md bg-neutral-800 p-2 pl-9 text-neutral-300 ring-2 ring-neutral-700 transition duration-100 placeholder:font-medium placeholder:text-neutral-700 focus:outline-none focus:ring-red-600 focus:placeholder:text-neutral-500"
            placeholder="Search..."
            onChange={onChange || undefined}
            defaultValue={initialValue && initialValue}
          />
          {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
          <i className="ri-search-line ri-lg z-10 px-2 py-3 font-medium text-neutral-500" />
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
