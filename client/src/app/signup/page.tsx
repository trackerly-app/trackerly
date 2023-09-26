'use client';

import Image from 'next/image';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import logo from 'public/trackerly.svg';
import axios from 'axios';
import React, { FormEvent, useRef, useState } from 'react';
import useStore from '../../lib/store';

// make these required as implementation increases
type ValidInput = {
  username?: string;
  password?: string;
  confirmPassword: string;
};

const defaultValidInput = {
  confirmPassword: '',
};

const signup: React.FC = () => {
  const username = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const passwordConfirm = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<ValidInput>(defaultValidInput);
  const { setUserId } = useStore();
  const { push } = useRouter();

  const validate = () => {
    if (password.current?.value !== passwordConfirm.current?.value) {
      setError({
        confirmPassword: 'Passwords do not match',
      });
    } else {
      setError(defaultValidInput);
    }
  };

  async function signUpUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (error.confirmPassword) return;
    try {
      const formData = new FormData(event.currentTarget);
      const res = await axios.post('http://localhost:4000/signup', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      // what do we do from here? return home?
      if (res.status === 200) {
        setUserId(res.data);
        push('/dashboard');
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center'>
          <Image
            src={logo}
            width={68}
            height={58}
            alt='Trackerly-logo'
          />
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            Sign up to your account
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form
            className='space-y-6'
            onSubmit={signUpUser}
          >
            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Username
              </label>
              <div className='mt-2'>
                <input
                  id='username'
                  name='username'
                  type='text'
                  ref={username}
                  required
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Email address
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  ref={email}
                  required
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Password
                </label>
              </div>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  onChange={validate}
                  ref={password}
                  required
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  confirm password
                </label>
              </div>
              <div className='mt-2'>
                <input
                  id='passwordConfirm'
                  name='passwordConfirm'
                  type='password'
                  autoComplete='current-password'
                  required
                  ref={passwordConfirm}
                  onChange={validate}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 sm:text-sm sm:leading-6'
                />
              </div>
              {error.confirmPassword && (
                <span className='error'>{error.confirmPassword}</span>
              )}
            </div>

            <div>
              <button
                type='submit'
                className='flex w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600'
              >
                Sign up
              </button>
            </div>
          </form>

          <p className='mt-10 text-center text-sm text-gray-500'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='font-semibold leading-6 text-violet-600 hover:text-violet-500'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default signup;
