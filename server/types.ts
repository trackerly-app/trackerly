export type  GlobalError = {
    log: string;
    status: number;
    message: string | { err: string };
};

export type SignupRequestBody = {
  email: any
  username: any
  password: any
};