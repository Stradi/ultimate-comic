import { visit } from 'unist-util-visit';

interface IOptions {
  publicPath: string;
}

type NodePosition = {
  start: {
    line: number;
    column: number;
    offset: number;
  };
  end: {
    line: number;
    column: number;
    offset: number;
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NodeChildren = any[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MdxNodeData = any;

type MdxImageNodeAttributes = [
  {
    type: string;
    name: string;
    value: string;
  }
];

type MdxImageNode = {
  type: string;
  name: string;
  attributes: MdxImageNodeAttributes;
  children: NodeChildren;
  position: NodePosition;
  data: MdxNodeData;
};

type MdImageNode = {
  type: string;
  title: string;
  url: string;
  alt: string;
  position: NodePosition;
};

type ImageNode = MdxImageNode | MdImageNode;

const remarkNextImage = ({ publicPath }: IOptions) => {
  if (!publicPath) {
    throw Error(
      `Required 'publicPath' option is missing in remark-next-image configuration.`
    );
  }

  const visitor = (node: ImageNode) => {
    if (
      node.type === 'mdxJsxFlowElement' &&
      (node as MdxImageNode).name === 'img'
    ) {
      const n = node as MdxImageNode;
      n.attributes[0].value = `${publicPath}/${n.attributes[0].value}`;
    } else if (node.type === 'image') {
      const n = node as MdImageNode;
      n.url = `${publicPath}/${n.url}`;
    }
  };

  const transform = (tree: any) => {
    visit(tree, 'mdxJsxFlowElement', visitor);
    visit(tree, 'image', visitor);
  };

  return transform;
};

export { remarkNextImage };
