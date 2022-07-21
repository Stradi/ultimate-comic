import Link from 'next/link';

import cx from 'classnames';

interface IButtonProps {
  href: string;
  text: string;
  type: 'default' | 'minimal';
  className?: string;
}

interface IButtonTypeProps {
  href: string;
  text: string;
  className?: string;
}

const DefaultButton = ({ href, text, className }: IButtonTypeProps) => {
  const classes = cx(
    'py-2 px-4 text-white bg-red-600 hover:bg-red-800 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-100',
    className
  );
  return (
    <Link href={href}>
      <a className={classes}>{text}</a>
    </Link>
  );
};

const MinimalButton = ({ href, text, className }: IButtonTypeProps) => {
  const classes = cx(
    'py-2 px-4 hover:text-white rounded-md border-2 border-neutral-800 hover:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors duration-100',
    className
  );
  return (
    <Link href={href}>
      <a className={classes}>{text}</a>
    </Link>
  );
};

const Button = ({ href, text, type, className }: IButtonProps) => {
  if (type === 'default') {
    return <DefaultButton href={href} text={text} className={className} />;
  } else {
    return <MinimalButton href={href} text={text} className={className} />;
  }
};

export { Button };
