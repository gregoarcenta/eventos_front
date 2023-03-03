export interface ResponseCatalog {
  status:  number;
  message: null;
  data:    DataCatalog[];
}

export interface DataCatalog {
  id:           number;
  name:         string;
  province_id?: number;
}
