import React, { useEffect, useRef } from 'react';

// we do it this way for faster mapping of imported data with field data
type Field = {
  [name: string]: {
    value: string | number | undefined;
    type: string;
    title?: string;
  };
};

export type AppProps = {
  id?: number;
  user_id: number;
};

const inputFields: Array<Field> = [
  {
    company: {
      value: undefined,
      type: 'text',
      title: 'Company Name',
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

  async function save(formData: FormData) {
    const res = await fetch('http://localhost:4000/SAVE PATH', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // what do we do from here? return home
  }

  // hidden fields within the React Element to use props
  const hiddenFields: Array<Field> = [
    {
      user_id: {
        value: props.user_id,
        type: 'hidden',
      },
    },
  ];

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
    <form action={save}>
      {hiddenFields.map((field: Field) => {
        const name = Object.keys(field)[0];

        return (
          <div className='hidden'>
            <input
              type={field[name].type}
              name={name}
              value={field[name].value}
            />
          </div>
        );
      })}
      {inputFields.map((field: Field, i: number) => {
        const name = Object.keys(field)[0];

        return (
          <div className='field'>
            <label htmlFor={name}>{field[name].title}</label>
            <input
              type={field[name].type}
              id={name}
              name={name}
              defaultValue={field[name].value}
              ref={(el) => (refs.current[i] = el)}
            />
          </div>
        );
      })}
      <div className='field'>
        <button>Save Application</button>
      </div>
    </form>
  );
};

export default ApplicationForm;
