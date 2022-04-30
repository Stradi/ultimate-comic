interface ISidebarProps {
  children: React.ReactNode;
  width: '1/3' | '1/4';
}

const Sidebar = ({ children, width }: ISidebarProps) => {
  return (
    <aside className={`sticky top-2 px-2 w-${width} h-fit`}>{children}</aside>
  );
};

export { Sidebar };
