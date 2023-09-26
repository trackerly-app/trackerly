'use client';

import CompanyForm from '../components/CompanyForm';
import useStore from '../../lib/store';

export default function Company() {
  const { user_id } = useStore();
  return (
    <>
      <CompanyForm user_id={user_id} />
    </>
  );
}
