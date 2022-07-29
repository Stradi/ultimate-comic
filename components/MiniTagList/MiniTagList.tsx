import { ITagDocument } from '~/lib/database/models';
import { SingleTag } from './SingleTag';

interface IMiniTagListProps {
  tags: ITagDocument[];
}

const MiniTagList = ({ tags }: IMiniTagListProps) => {
  const tagsDOM = tags.map((tag) => <SingleTag tag={tag} key={tag._id} />);

  return (
    <div className="sm:my-0 sm:grid sm:grid-cols-2 sm:gap-2 md:grid-cols-4">
      {tagsDOM}
    </div>
  );
};

export { MiniTagList };
