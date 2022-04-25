import type { GetStaticProps, NextPage } from 'next';
import { Container } from '~/components/Container';
import { LatestIssues } from '~/components/LatestIssues';
import { getLatestIssues } from '~/lib/database';
import { IIssueDocument } from '~/lib/database/models';
import { callDb } from '~/lib/utils/database';

interface IHomePageProps {
  newIssues: IIssueDocument[];
}

const Home: NextPage<IHomePageProps> = ({ newIssues }: IHomePageProps) => {
  return (
    <Container>
      <LatestIssues issues={newIssues} title="Latest Issues" />
    </Container>
  );
};

export const getStaticProps: GetStaticProps<IHomePageProps> = async () => {
  const newIssues = await callDb(
    getLatestIssues(50, 0, 'name slug images.0 comic createdAt', [
      {
        fieldName: 'comic',
        fields: 'name slug',
      },
    ]),
    true
  );

  return {
    props: {
      newIssues,
    },
  };
};

export default Home;
