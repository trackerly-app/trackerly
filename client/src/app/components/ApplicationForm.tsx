import React, { useEffect, useRef, FormEvent } from 'react';

// we do it this way for faster mapping of imported data with field data
type Field = {
  [name: string]: {
    value: string | number | undefined;
    type?: string;
    title?: string;
    readonly?: boolean;
  };
};

export type AppProps = {
  id?: number;
  user_id: number;
  company_id: number;
  company_name: string;
};

export function validateData(data: FormData) {}

const ApplicationForm = (props: AppProps) => {
  // a function to call if the application has an id
  async function getId(id: number) {
    const res = await fetch('http://localhost:4000/GET PATH');

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      throw TypeError(res.statusText);
    }
  }

  const inputFields: Array<Field> = [
    {
      company: {
        value: props.company_name,
        type: 'text',
        title: 'Company Name',
        readonly: true,
      },
    },
    {
      position: {
        value: undefined,
        type: 'text',
        title: 'Position Title',
      },
    },
    {
      application_url: {
        value: undefined,
        type: 'text',
        title: 'Application URL',
      },
    },
    {
      salary: {
        value: undefined,
        type: 'text',
        title: 'Listed Salary',
      },
    },
    {
      status: {
        value: 'interested',
        type: 'text',
        title: 'Application Status',
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
  const hiddenFields: Array<Field> = [
    {
      user_id: {
        value: props.user_id,
      },
    },
    {
      company_id: {
        value: props.company_id,
      },
    },
  ];

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const res = await fetch('http://localhost:4000/SAVE PATH', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // what do we do from here? return home
  }

  useEffect(() => {
    if (props.id) {
      // why is getId returning a Promise, did I mess this up?
      getId(props.id).then((existingData) => {
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
      aria-label='edit_application'
    >
      {hiddenFields.map((field: Field) => {
        const name = Object.keys(field)[0];

        return (
          <div
            className='hidden'
            key={name}
          >
            <input
              type='hidden'
              name={name}
              value={field[name].value}
              data-testid={name}
            />
          </div>
        );
      })}
      {inputFields.map((field: Field, i: number) => {
        const name = Object.keys(field)[0];
        const isReadOnly = field[name].readonly === true;

        return (
          <div
            className='field'
            key={name}
          >
            <label htmlFor={name}>{field[name].title}</label>
            <input
              type={field[name].type}
              id={name}
              name={name}
              defaultValue={field[name].value}
              ref={(el) => (refs.current[i] = el)}
              readOnly={isReadOnly}
              data-testid={name}
            />
          </div>
        );
      })}
      <div className='field'>
        <button
          data-testid='submit_button'
          key='submit'
        >
          Save Application
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;
