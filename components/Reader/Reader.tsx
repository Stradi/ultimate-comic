import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [zoom, setZoom] = useState('sm:w-3/6');

  const pageSelectRef = useRef<HTMLSelectElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

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
        if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
          goToPage(pageNumber - 1);
        } else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
          goToPage(pageNumber + 1);
        } else if (key === 'z' || key === 'Z') {
          setZoom(zoom === 'md:w-3/6' ? 'md:w-4/6' : 'md:w-3/6');
        }
      } else {
        pageSelectRef.current?.blur();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageNumber, zoom]
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

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const imageWidth = imageRef.current?.offsetWidth || 0;

    if (e.clientX < imageWidth / 2) {
      goToPage(pageNumber - 1);
    } else {
      goToPage(pageNumber + 1);
    }
  };

  return (
    <>
      <Modal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
      >
        <span>Do you want to go to next issue?</span>
        <div className="mt-2 flex justify-between gap-2">
          <button
            className="w-full rounded-md bg-neutral-900 p-2 transition hover:ring-2 hover:ring-red-600 focus:outline-none"
            onClick={() => setIsConfirmationModalOpen(false)}
          >
            No
          </button>
          <button
            className="w-full rounded-md bg-neutral-900 p-2 transition hover:ring-2 hover:ring-green-600 focus:outline-none"
            onClick={() => onFinished && onFinished()}
          >
            Yes
          </button>
        </div>
      </Modal>
      <div className={`mx-auto ${zoom}`}>
        <div className="my-2 text-center">
          Page
          <select
            ref={pageSelectRef}
            className="mx-2 rounded-md bg-neutral-800 p-1 ring-2 ring-neutral-700 focus:outline-none focus:ring-red-600"
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
        <div className="mx-auto w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[pageNumber]}
            alt={`Page #${pageNumber}`}
            className="rounded-md"
            onClick={handleImageClick}
            ref={imageRef}
          />
        </div>
      </div>
    </>
  );
};

export { Reader };
