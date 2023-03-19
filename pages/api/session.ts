import { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'

const getSession = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req);
  return {
    props: {
      session
    }
  }
}

export default getSession;
