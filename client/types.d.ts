export type InputField = {
  [name: string]: {
    value: string | number | undefined;
    type?: string;
    title?: string;
    readonly?: boolean;
  };
};

export type Company = {
  id: number;
  name: string;
  website: string;
  notes: string;
};

export type Application = {
  id: number;
  company_id: number;
  name: string;
  websit: string;
  position: string;
  salary: number;
  status: string; // enumerated status
  notes: string;
  application_url: string;
  created_on: Date;
};
