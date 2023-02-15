export interface ResponseUser {
  status:  number;
  message: string;
  data:    Data;
}

export interface Data {
  user: User;
  jwt:  string;
}

export interface User {
  id?:                    number;
  name:                   string;
  surname:                string;
  username:               string;
  email:                  string;
  num_document:           null;
  img:                    null;
  age:                    null;
  phone:                  null;
  document_id:            null;
}
