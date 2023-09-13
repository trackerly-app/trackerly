import React, { useEffect, useRef, FormEvent } from 'react';
import axios from 'axios';
import { InputField } from '../../../types';

export type AppProps = {
  id: number;
  status: string;
  date?: string;
};

// a function to call if the application has an id
async function load(id: number) {
  try {
    const res = await axios.get('http://localhost:4000/GET PATH');

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

async function save(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  try {
    const formData = new FormData(event.currentTarget);
    const res = await axios.post('http://localhost:4000/SAVE PATH', formData);

    // what do we do from here? return home?
  } catch (err) {
    console.log(err);
  }
}

export default function QuickUpdate(props: AppProps) {
  const inputFields: Array<InputField> = [
    {
      status: {
        value: props.status,
        type: 'text',
        title: 'Company Name',
        readonly: true,
      },
    },
  ];

  // hidden fields within the React Element to use props
  const hiddenFields: Array<InputField> = [
    {
      id: {
        value: props.id,
      },
    },
  ];

  useEffect(() => {
    if (props.id) {
      // why is getId returning a Promise, did I mess this up?
      load(props.id).then((existingData) => {
        for (const col of existingData) {
          inputFields[col].value = existingData[col];
        }
      });
    }
  }, []);

  // use this to save the state of the input field
  const refs = useRef(new Array(inputFields.length));

  return (
    <form
      onSubmit={save}
      aria-label='patch_application'
      className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6'
    >
      {hiddenFields.map((field: InputField) => {
        const name = Object.keys(field)[0];

        return (
          <div key={name}>
            <input
              type='hidden'
              name={name}
              value={field[name].value}
              data-testid={name}
            />
          </div>
        );
      })}
      {inputFields.map((field: InputField, i: number) => {
        const name = Object.keys(field)[0];

        const fieldRef = (el: any) => {
          return (refs.current[i] = el);
        };

        const options = {
          type: field[name].type,
          id: name,
          name: name,
          defaultValue: field[name].value,
          ref: fieldRef,
          readOnly: field[name].readonly,
          'data-testid': name,
          className:
            'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
        };

        return (
          <div key={name}>
            <label
              htmlFor={name}
              className='block text-sm font-medium leading-6 text-gray-9000'
            >
              {field[name].title}
            </label>
            <div className='mt-2'>
              {options.type === 'textarea' ? (
                <textarea {...options} />
              ) : (
                <input {...options} />
              )}
            </div>
          </div>
        );
      })}
      <div>
        <button
          data-testid='submit_button'
          key='submit'
          className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          Update Status
        </button>
      </div>
    </form>
  );
}
