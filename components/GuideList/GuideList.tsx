import { SingleGuide } from './SingleGuide';

interface IGuideListProps {
  guides: GuidePage[];
}

const GuideList = ({ guides }: IGuideListProps) => {
  const guidesDOM = guides.map((guide) => (
    <SingleGuide guide={guide} key={guide.slug} />
  ));

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{guidesDOM}</div>
  );
};

export { GuideList };
