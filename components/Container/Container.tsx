interface IContainerProps {
  className?: string;
  children?: React.ReactNode;
}

const Container = ({ children, className }: IContainerProps) => {
  return (
    <div className={`${className} container mx-auto max-w-5xl`}>{children}</div>
  );
};

export { Container };
