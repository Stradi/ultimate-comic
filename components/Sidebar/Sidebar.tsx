interface ISidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: ISidebarProps) => {
  return (
    <aside className={`md:sticky md:w-1/4 top-2 px-2 h-fit`}>{children}</aside>
  );
};

export { Sidebar };
