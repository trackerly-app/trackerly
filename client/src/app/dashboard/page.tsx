'use client';

import Dashboard from '../containers/Dashboard';
import Sidebar from '../containers/Sidebar';
import React, {useEffect} from 'react';
import axios from 'axios';
import useStore from '../store';
import {useRouter} from 'next/navigation';

const page = () => {	
	const {user_id, applications, setApplications, setCompanies } = useStore();
	const {push} = useRouter();
	
	function createApplication() {
		push('/application');
	}

	async function getApplications() {
		const res = await axios.get('http://localhost:4000/allapps/' + user_id);
		console.log(res);
		setApplications(res.data);
	}

	async function getCompanies() {
		const res = await axios.get('http://localhost:4000/company/' + user_id);
		console.log(res.data);
		setCompanies(res.data);
	}

	useEffect(() => {
		getApplications()
		getCompanies();
	}, []);

	return (
		<div className='inline-flex flex-row items-stretch w-full pr-5'>
			<div className='flex flex-col items-stretch w-full pr-5 pt-5'>
				<Dashboard />
				<button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 mt-5" onClick={createApplication} >New Application</button>

			</div>
		</div>
	);
};

export default page;
