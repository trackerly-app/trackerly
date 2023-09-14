'use client';

import Image from 'next/image';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import logo from 'public/trackerly.svg';
import axios from 'axios';
import { FormEvent, useRef } from 'react';
import useStore from '../store';

async function googleOAuth(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
	try {
		event.preventDefault();
		window.location.href = 'http://localhost:4000/auth/google';

	}catch (err) {
		console.log(err);
	}

}
async function githubOAuth(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
	try {
		event.preventDefault();
		window.location.href = 'http://localhost:4000/auth/github';
	
	}catch (err) {
		console.log(err);
	}

}
const login: React.FC = () => {
	const email = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const form = useRef<HTMLFormElement>(null)

	const { setUserId } = useStore();
	const {push} = useRouter();
	
	async function loginUser(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		
		try {
			const formData = new FormData(event.currentTarget);
			const res = await axios.post('http://localhost:4000/login', formData, {headers: {'Content-Type': 'application/json'}});
			console.log(res);

			// what do we do from here? return home?
			if (res.status === 200) {
				// const storeId = useStore(state => state.user_id);			
				setUserId(res.data);
				push('/dashboard');
			}
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
					<Image src={logo} width={68} height={58} alt="Trackerly-logo" />
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
						Sign in to your account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-6" onSubmit={loginUser} ref={form}>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium leading-6 text-gray-900"
							>
								Email address
							</label>
							<div className="mt-2">
								<input
									id="email"
									type="email"
									name="email"
									autoComplete="email"
									ref={email}
									required
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="block text-sm font-medium leading-6 text-gray-900"
									
								>
									Password
								</label>
								<div className="text-sm">
									<a
										href="#"
										className="font-semibold text-violet-600 hover:text-violet-500"
									>
										Forgot password?
									</a>
								</div>
							</div>
							<div className="mt-2">
								<input
									id="password"
									type="password"
									autoComplete="current-password"
									name="password"
									required
									ref={password}
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6"
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="flex w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
							>
								Sign in
							</button>
						</div>
					</form>
						<div className="mt-2">
							<button onClick={googleOAuth} className="flex w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600" >
								
								Google Login
							</button>
						</div>
						<div className="mt-2">
							<button onClick={githubOAuth} className="flex w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600" >
								
								Github Login
							</button>
						</div>

					<p className="mt-10 text-center text-sm text-gray-500">
						Don't have an account?{' '}
						<Link
							href="/signup"
							className="font-semibold leading-6 text-violet-600 hover:text-violet-500"
						>
							Sign up
						</Link>
					</p>
				</div>
			</div>
		</>
	);
};

export default login;
