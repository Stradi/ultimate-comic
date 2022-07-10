import { Node, visit } from 'unist-util-visit';

interface IOptions {
  publicPath: string;
}

interface ImageNode {
  type: string;
  title: string;
  url: string;
  alt: string;
  position: {
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
}

const remarkNextImage = ({ publicPath }: IOptions) => {
  if (!publicPath) {
    throw Error(
      `Required 'publicPath' option is missing in remark-next-image configuration.`
    );
  }

  const visitor = (node: ImageNode) => {
    node.url = `${publicPath}/${node.url}`;
  };

  const transform = (tree: Node) => {
    visit(tree, 'image', visitor);
  };

  return transform;
};

export { remarkNextImage };
