interface INewReaderProps {
  images: string[];
}

const NewReader = ({ images }: INewReaderProps) => {
  return (
    <>
      <div className="mt-8 space-y-2">
        {images.map((image, index) => {
          if (index % 10 === 0) {
            // TODO: Return ad here
          }

          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={index}
              src={image}
              alt={`Page #${index}`}
              loading="lazy"
              className="mx-auto sm:max-w-4xl"
            />
          );
        })}
      </div>
    </>
  );
};

export { NewReader };
