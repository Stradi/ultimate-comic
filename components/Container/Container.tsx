interface IContainerProps {
  className?: string;
  children?: React.ReactNode;
}

const Container = ({ children, className }: IContainerProps) => {
  return (
    <div className={`${className} container mx-auto max-w-7xl px-2`}>
      {children}
    </div>
  );
};

export { Container };
