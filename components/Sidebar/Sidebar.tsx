interface ISidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: ISidebarProps) => {
  return (
    <aside className={`top-2 h-fit px-2 md:sticky md:w-1/4`}>{children}</aside>
  );
};

export { Sidebar };
