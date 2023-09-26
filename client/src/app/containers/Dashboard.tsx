'use client';

import React, { useEffect } from 'react';
import ApplicationList from '../components/ApplicationList';
import useStore from '../../lib/store';
import axios from 'axios';

const Dashboard = () => {
  return (
    <>
      <ApplicationList />
    </>
  );
};

export default Dashboard;
