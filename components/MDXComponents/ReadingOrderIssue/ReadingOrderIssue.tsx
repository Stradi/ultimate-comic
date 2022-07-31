import { useState } from 'react';

interface IReadingOrderIssueProps {
  name: string;
  hrefTemplate: string;
  start: number;
  end: number;
  issue: string;
}

const ReadingOrderIssue = ({
  name,
  hrefTemplate,
  start,
  end,
  issue,
}: IReadingOrderIssueProps) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const getAccordionItemsDOM = () => {
    const dom = [];
    for (let i = start; i <= end; i++) {
      dom.push(
        <a
          href={`${hrefTemplate}${i}`}
          key={`${name} Issue #${i}`}
          className="mb-1 block rounded-lg bg-neutral-900 py-1 px-2 no-underline transition duration-100 hover:translate-x-2 hover:bg-neutral-800 hover:!text-white"
        >
          {`${name} #${i}`}
        </a>
      );
    }

    return dom;
  };

  return (
    <div>
      {!start && !end && issue && (
        <a
          href={`${hrefTemplate}${issue.toLowerCase()}`}
          className="mb-2 block rounded-lg bg-neutral-900 px-4 py-2 font-medium no-underline transition duration-100 hover:cursor-pointer hover:bg-neutral-800 hover:!text-white"
        >{`${name} #${issue}`}</a>
      )}
      {start !== end && (
        <>
          <div
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="mb-2 rounded-lg bg-neutral-900 px-4 py-2 font-medium transition duration-100 hover:cursor-pointer hover:bg-neutral-800 hover:text-white"
          >
            {`${name} #${start}-${end}`}
          </div>
          <div className="mx-4">
            {isAccordionOpen && getAccordionItemsDOM()}
          </div>
        </>
      )}
    </div>
  );
};

export { ReadingOrderIssue };
