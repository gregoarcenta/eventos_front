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
  num_document:           string | null;
  img:                    string | null;
  age:                    number | null;
  phone:                  string | null;
  document_id:            number | null;
}
