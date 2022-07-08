interface ISidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: ISidebarProps) => {
  return <aside className={`md:sticky top-2 px-2 h-fit`}>{children}</aside>;
};

export { Sidebar };
