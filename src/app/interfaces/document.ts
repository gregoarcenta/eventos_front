export interface ResponseDocuments {
  status:  number;
  message: null;
  data:    Document[];
}

export interface Document {
  id:   number;
  name: string;
}
