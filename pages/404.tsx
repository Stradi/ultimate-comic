import { NextPage } from 'next';
import { Button } from '~/components/Button';
import { Container } from '~/components/Container';

const NotFoundPage: NextPage = () => {
  return (
    <Container>
      <div className="text-center align-middle">
        <h1 className="text-9xl font-black text-white">404</h1>
        <p className="mb-8 text-7xl"> This page does not exists</p>
        <div className="flex justify-center gap-2 text-2xl">
          <Button href="/" text="Home" type="default" />
          <Button href="/all-comics" text="All Comics" type="minimal" />
        </div>
      </div>
    </Container>
  );
};

export default NotFoundPage;
