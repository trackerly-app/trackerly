export type InputField = {
  [name: string]: {
    value: string | number | undefined;
    type?: string;
    title?: string;
    readonly?: boolean;
  };
};
