interface IContainerProps {
  className?: string;
  children?: React.ReactNode;
}

const Container = ({ children, className }: IContainerProps) => {
  return (
    <div className={`${className} mx-auto max-w-full sm:max-w-xl md:max-w-3xl`}>
      {children}
    </div>
  );
};

export { Container };
