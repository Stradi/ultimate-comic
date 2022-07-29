import { NextPage } from 'next';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';

const ServerErrorPage: NextPage = () => {
  return (
    <Container>
      <div className="text-center align-middle">
        <h1 className="text-9xl font-black text-white">500</h1>
        <p className="mb-8 text-7xl">Something happened in our side</p>
        <div className="flex justify-center gap-2 text-2xl">
          <Button href="/" text="Home" type="default" />
          <Button href="/all-comics" text="All Comics" type="minimal" />
        </div>
      </div>
    </Container>
  );
};

export default ServerErrorPage;
