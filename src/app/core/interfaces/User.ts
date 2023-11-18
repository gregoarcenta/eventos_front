export interface IUserAuth {
  user: IUser;
  jwt:  string;
}

export interface IUser {
  id?:                    number;
  name:                   string;
  surname:                string;
  username:               string;
  email:                  string;
  img:                    string | null;
  age:                    number | null;
  phone:                  string | null;
  num_document:           string | null;
  document_id:            number | null;
  business_name:          string | null;
}
