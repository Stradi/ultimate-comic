import { NextPageContext } from 'next';
import NextErrorComponent from 'next/error';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';

interface ICustomErrorComponentProps {
  statusCode: number;
}

const CustomErrorComponent = ({ statusCode }: ICustomErrorComponentProps) => {
  return (
    <Container>
      <div className="text-center align-middle">
        <h1 className="text-9xl font-black text-white">{statusCode}</h1>
        <p className="mb-8 text-7xl">Something happened in our side.</p>
        <p className="mb-8 text-4xl">We are investigating the problem.</p>
        <div className="flex justify-center gap-2 text-2xl">
          <Button href="/" text="Home" type="default" />
          <Button href="/all-comics" text="All Comics" type="minimal" />
        </div>
      </div>
    </Container>
  );
};

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  return NextErrorComponent.getInitialProps(contextData);
};

export default CustomErrorComponent;
