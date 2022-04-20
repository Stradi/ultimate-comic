import { default as NextImg } from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from '../Modal';

interface IReaderProps {
  images: string[];
  cacheLength?: number;
  onFinished?: () => void;
}

//TODO: Refactor
const Reader = ({ images, cacheLength = 2, onFinished }: IReaderProps) => {
  //TODO: Add reading mode option
  // All images in one page || single image per page
  const [pageNumber, setPageNumber] = useState(0);
  const [inEnd, setInEnd] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const pageSelectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardNavigation);
    return () => {
      window.removeEventListener('keydown', handleKeyboardNavigation);
    };
  });

  useEffect(() => {
    if (pageNumber < images.length - cacheLength) {
      for (let i = pageNumber; i <= pageNumber + cacheLength; i++) {
        const img = new Image();
        img.src = images[i];
      }
    }
  }, [pageNumber, cacheLength, images]);

  const handleKeyboardNavigation = useCallback(
    (e: KeyboardEvent) => {
      if (pageSelectRef.current !== document.activeElement) {
        const { key } = e;
        if (key === 'ArrowLeft' || key === 'a') {
          goToPage(pageNumber - 1);
        } else if (key === 'ArrowRight' || key === 'd') {
          goToPage(pageNumber + 1);
        }
      } else {
        pageSelectRef.current?.blur();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageNumber]
  );

  const goToPage = (page: number) => {
    if (page >= images.length && inEnd) {
      if (!isConfirmationModalOpen) {
        setIsConfirmationModalOpen(true);
      }
    } else {
      setIsConfirmationModalOpen(false);
    }

    if (page < 0 || page >= images.length) {
      return;
    }

    if (page === images.length - 1) {
      setInEnd(true);
    } else {
      setInEnd(false);
    }
    setPageNumber(page);
  };

  return (
    <>
      <Modal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
      >
        <span>Do you want to go to next issue?</span>
        <div className="flex gap-2 justify-between mt-2">
          <button
            className="p-2 w-full bg-neutral-900 rounded-md focus:outline-none hover:ring-2 hover:ring-red-600 transition"
            onClick={() => setIsConfirmationModalOpen(false)}
          >
            No
          </button>
          <button
            className="p-2 w-full bg-neutral-900 rounded-md focus:outline-none hover:ring-2 hover:ring-green-600 transition"
            onClick={() => onFinished && onFinished()}
          >
            Yes
          </button>
        </div>
      </Modal>
      <div className="mx-auto w-full sm:w-2/3">
        <div className="my-2 text-center">
          Page
          <select
            ref={pageSelectRef}
            className="p-1 mx-2 rounded-md focus:outline-none ring-2 ring-neutral-800 focus:ring-blue-600"
            onChange={(e) => goToPage(Number.parseInt(e.currentTarget.value))}
            value={pageNumber}
          >
            {Array.from({ length: images.length }).map((_, i) => (
              <option key={i + 1} value={i}>
                {i + 1}
              </option>
            ))}
          </select>
          of <span className="font-medium">{images.length}</span>
        </div>
        <NextImg
          src={images[pageNumber]}
          layout="responsive"
          width={1}
          height={1.53}
          alt={`Page #${pageNumber}`}
          onClick={() => goToPage(pageNumber + 1)}
          unoptimized={true}
        />
      </div>
    </>
  );
};

export { Reader };
