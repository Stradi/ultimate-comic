import Link from 'next/link';

interface IButtonProps {
  href: string;
  text: string;
  type: 'default' | 'minimal';
}

interface IButtonTypeProps {
  href: string;
  text: string;
}

const DefaultButton = ({ href, text }: IButtonTypeProps) => {
  return (
    <Link href={href}>
      <a className="py-2 px-4 text-white bg-red-600 hover:bg-red-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-100">
        {text}
      </a>
    </Link>
  );
};

const MinimalButton = ({ href, text }: IButtonTypeProps) => {
  return (
    <Link href={href}>
      <a className="py-2 px-4 hover:text-white rounded-md border-2 border-neutral-800 hover:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-100">
        {text}
      </a>
    </Link>
  );
};

const Button = ({ href, text, type }: IButtonProps) => {
  if (type === 'default') {
    return <DefaultButton href={href} text={text} />;
  } else {
    return <MinimalButton href={href} text={text} />;
  }
};

export { Button };
