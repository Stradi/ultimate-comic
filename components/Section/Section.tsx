import { Button } from '../Button';

interface ISectionProps {
  title?: string;
  subtitle?: string;
  showSeeAllButton?: boolean;
  seeAllButtonHref?: string;
  children: React.ReactElement;
}

const Section = ({
  title = 'Section',
  subtitle = 'Subtitle',
  showSeeAllButton = true,
  seeAllButtonHref = '/',
  children,
}: ISectionProps) => {
  return (
    <div>
      <header className="mt-4 mb-2 flex items-center justify-between">
        <div className="flex w-2/3 flex-col">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
          <p className="text-neutral-400 sm:text-lg">{subtitle}</p>
        </div>
        {showSeeAllButton && (
          <Button href={seeAllButtonHref} text="See All" type="minimal" />
        )}
      </header>
      <main>{children}</main>
    </div>
  );
};

export { Section };
