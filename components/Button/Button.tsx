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
      <a className="py-2 px-4 text-white bg-blue-600 hover:bg-blue-800 rounded-md transition-colors duration-100">
        {text}
      </a>
    </Link>
  );
};

const MinimalButton = ({ href, text }: IButtonTypeProps) => {
  return (
    <Link href={href}>
      <a className="py-2 px-4 hover:text-blue-800 rounded-md border-2 border-neutral-800 hover:border-blue-800 transition-colors duration-100">
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
