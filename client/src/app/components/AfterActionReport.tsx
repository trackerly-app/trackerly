import React, { useEffect, useRef, FormEvent } from 'react';
import axios from 'axios';
import { InputField } from '../../../types';

// we do it this way for faster mapping of imported data with field data

export type AppProps = {
  id?: number;
  application_id: number;
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

function addFields(
  inputFields: Array<InputField>,
  refs: React.MutableRefObject<any[]>
) {
  let returnObj: React.Component;

  inputFields.map((field: InputField, i: number) => {
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
  });
}

export default function AfterActionReport(props: AppProps) {
  const planningPhase: Array<InputField> = [
    {
      date: {
        value: undefined,
        type: 'date',
        title: 'Interview Date',
      },
    },
    {
      objective: {
        value: undefined,
        type: 'text',
        title: 'Position Title',
      },
    },
    {
      resource_and_prep: {
        value: undefined,
        type: 'text',
        title: 'Application URL',
      },
    },
    {
      challenges: {
        value: undefined,
        type: 'text',
        title: 'Listed Salary',
      },
    },
  ];
  const executionPhase = [
    {
      key_moments: {
        value: 'interested',
        type: 'textarea',
        title: 'Key Moments & Observations',
      },
    },
  ];

  const assessmentPhase = [
    {
      successes: {
        value: undefined,
        type: 'textarea',
        title: 'Successes',
      },
    },
    {
      areas_for_improvement: {
        value: undefined,
        type: 'textarea',
        title: 'Areas for Improvement',
      },
    },
    {
      root_causes: {
        value: undefined,
        type: 'textarea',
        title: 'Root Causes',
      },
    },
    {
      solutions: {
        value: undefined,
        type: 'textarea',
        title: 'Solutions & Recommendations',
      },
    },
  ];
  const feedBackFields = [
    {
      feedback: {
        value: undefined,
        type: 'textarea',
        title: 'Feedback Loop',
      },
    },
    {
      notes: {
        value: undefined,
        type: 'textarea',
        title: 'Notes & Reflections',
      },
    },
    {
      next_steps: {
        value: undefined,
        type: 'textarea',
        title: 'Next Steps',
      },
    },
  ];

  // hidden fields within the React Element to use props
  const hiddenFields: Array<InputField> = [
    {
      id: {
        value: props.application_id,
      },
    },
  ];

  useEffect(() => {
    if (props.id) {
      // why is getId returning a Promise, did I mess this up?
      load(props.id).then((existingData) => {
        // handle this per input
      });
    }
  }, []);

  // use this to save the state of the input field
  const combinedArrays = [
    ...planningPhase,
    ...executionPhase,
    ...assessmentPhase,
    ...feedBackFields,
  ];
  const refs = useRef(new Array(combinedArrays.length));

  return (
    <form
      onSubmit={save}
      aria-label='edit_application'
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
      <h1>Planning Phase</h1>
      <div>
        <button
          data-testid='submit_button'
          key='submit'
          className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        >
          Save Report
        </button>
      </div>
    </form>
  );
}
