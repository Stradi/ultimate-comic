interface IContainerProps {
  className?: string;
  children?: React.ReactNode;
}

const Container = ({ children, className }: IContainerProps) => {
  return (
    <div className={`${className} mx-auto container max-w-5xl`}>{children}</div>
  );
};

export { Container };
