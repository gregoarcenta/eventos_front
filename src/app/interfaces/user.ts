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
  id:                    number;
  name:                  string;
  surname:               string;
  username:              string;
  email:                 string;
  status:                boolean;
  google:                boolean;
  email_verif:           boolean;
  num_document:          null;
  img:                   null;
  age:                   null;
  phone:                 null;
  jwt_reset_token:       null;
  jwt_reset_token_valid: boolean;
  created_at:            Date;
  updated_at:            Date;
  role_id:               number;
  document_id:           null;
  role:                  Role;
}

export interface Role {
  id:   number;
  name: string;
}
