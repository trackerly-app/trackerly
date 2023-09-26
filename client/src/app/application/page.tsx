'use client';

import ApplicationForm from '../components/ApplicationForm';
import useStore from '../../lib/store';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Application = () => {
  const { companies, user_id } = useStore();
  const { push } = useRouter();

  useEffect(() => {
    if (!companies.length) {
      push('/application');
    }
  }, []);

  const appProps = {
    user_id: 1,
    company_id: 1,
    company_name: 'Test This',
    companies: companies,
  };

  const compProps = {
    user_id: 1,
  };

  return (
    <>
      <ApplicationForm {...appProps} />
    </>
  );
};

export default Application;
