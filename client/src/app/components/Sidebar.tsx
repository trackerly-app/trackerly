import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import logo from 'public/trackerly.svg';

const Sidebar = () => {
  return (
    <>
      <button
        data-drawer-target='logo-sidebar'
        data-drawer-toggle='logo-sidebar'
        aria-controls='logo-sidebar'
        type='button'
        className='inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
      >
        <span className='sr-only'>Open sidebar</span>
        <svg
          className='w-6 h-6'
          aria-hidden='true'
          fill='currentColor'
          viewBox='0 0 20 20'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            clip-rule='evenodd'
            fill-rule='evenodd'
            d='M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z'
          ></path>
        </svg>
      </button>

      <aside
        id='logo-sidebar'
        className='fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0'
        aria-label='Sidebar'
      >
        <div className='h-full px-3 py-4 overflow-y-auto  bg-violet-600 text-white'>
          <div className='flex items-end gap-5'>
            <Image
              src={logo}
              width={60}
              height={50}
              alt='Trackerly-logo'
            />

            <span className='self-center text-xl font-semibold whitespace-nowrap'>
              Trackerly
            </span>
          </div>

          <ul className='space-y-2 font-medium mt-10'>
            <li>
              <a
                href='#'
                className='flex items-center p-2 rounded-lg'
              >
                <svg
                  className='w-5 h-5 transition duration-75'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 22 21'
                >
                  <path d='M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z' />
                  <path d='M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z' />
                </svg>
                <span className='ml-3'>Dashboard</span>
              </a>
            </li>
          </ul>
          <ul className='space-y-2 font-medium mt-10'>
            <li>
              <a
                href='#'
                className='flex items-center p-2 rounded-lg'
              >
                <svg
                  className='w-5 h-5 transition duration-75'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='currentColor'
                  viewBox='0 0 22 21'
                >
                  <path d='M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z' />
                  <path d='M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z' />
                </svg>
                <span className='ml-3'>Dashboard</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <div className='p-4 sm:ml-64 h-100'>
        <div className='p-4 border-2 border-gray-200 border-dashed rounded-lg'>
          <div className='grid grid-cols-3 gap-4 mb-4'>
            <div className='flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800'>
              <p className='text-2xl text-gray-400 dark:text-gray-500'>
                <svg
                  className='w-3.5 h-3.5'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 18 18'
                >
                  <path
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M9 1v16M1 9h16'
                  />
                </svg>
              </p>
            </div>
            <div className='flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800'>
              <p className='text-2xl text-gray-400 dark:text-gray-500'>
                <svg
                  className='w-3.5 h-3.5'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 18 18'
                >
                  <path
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M9 1v16M1 9h16'
                  />
                </svg>
              </p>
            </div>
            <div className='flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800'>
              <p className='text-2xl text-gray-400 dark:text-gray-500'>
                <svg
                  className='w-3.5 h-3.5'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 18 18'
                >
                  <path
                    stroke='currentColor'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M9 1v16M1 9h16'
                  />
                </svg>
              </p>
            </div>
          </div>
          <div className='flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800'>
            <p className='text-2xl text-gray-400 dark:text-gray-500'>
              <svg
                className='w-3.5 h-3.5'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 18 18'
              >
                <path
                  stroke='currentColor'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M9 1v16M1 9h16'
                />
              </svg>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
