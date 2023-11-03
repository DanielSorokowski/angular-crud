export interface User {
  _id?: string,
  name: string,
  surname: string,
  email: string,
  age: number,
  premium: boolean,
  editing: false,
  [key: string]: any;
}
