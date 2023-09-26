import React, { useEffect, useRef, FormEvent } from 'react';
import axios from 'axios';
import { InputField } from '../../../types';

export type CompanyProps = {
  user_id: number;
  id?: number;
};

export async function getIcon(url: string): Promise<string> {
  // I think if we are going to store this in a database, we should probably store a binary string
  // representing the .png/.jpg/.ico image found. Not sure what's best
  let icon: string = 'I';

  try {
    // get the favicon from the url
    const urlRegex = new RegExp(/:\/\/(.*)\/.*/i);
    const urlMatch = url.match(urlRegex);
    console.log(urlMatch);
    const clippedUrl = urlMatch![1];

    const resolvedUrl =
      'https://www.google.com/s2/favicons?sz=256&domain_url=' + clippedUrl;

    console.log(resolvedUrl);
    const res = await axios.get(resolvedUrl, {
      withCredentials: false,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
    icon = await res.data;
    console.log(icon);
  } catch (err) {
    // better error handling needed
    console.log(err);
  }

  return icon;
}

async function load(id: number) {
  try {
    const res = await axios.get('http://localhost:4000/LOAD PATH');
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

async function save(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  try {
    const formData = new FormData(event.currentTarget);
    const res = await axios.post('http://localhost:4000/SAVE PATH', formData, {
      headers: { 'Content-Type': 'application/json' },
    });

    // what do we do from here? return home?
  } catch (err) {
    console.log(err);
  }
}

export default function CompanyForm(props: CompanyProps) {
  const inputFields: Array<InputField> = [
    {
      name: {
        value: undefined,
        type: 'text',
        title: 'Company Name',
      },
    },
    {
      website: {
        value: undefined,
        type: 'text',
        title: 'Company URL',
      },
    },
    {
      notes: {
        value: undefined,
        type: 'textarea',
        title: 'Notes & Reflections',
      },
    },
  ];

  // hidden fields within the React Element to use props
  const hiddenFields: Array<InputField> = [
    {
      user_id: {
        value: props.user_id,
      },
    },
    {
      id: {
        value: props.id,
      },
    },
  ];

  useEffect(() => {
    // async function loadIcon() {
    //   const icon = await getIcon('http://www.google.com');
    //   console.log(icon);
    // }
    // loadIcon();
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
      aria-label='edit_company'
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
          Save Company
        </button>
      </div>
    </form>
  );
}
