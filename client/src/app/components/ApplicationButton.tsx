'use client';

import { useRouter } from 'next/navigation';

type AppProps = {
  id: number;
  name: string;
};

export default function AppButton(props: AppProps) {
  const { push } = useRouter();

  function openApplication() {
    // does this open the whole application, or just the quick form
    push('/application/' + props.id);
  }

  return (
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
        <button
          className='ml-3'
          onClick={openApplication}
        >
          {props.name}
        </button>
      </a>
    </li>
  );
}
