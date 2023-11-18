import { ICatalog } from "./Catalog";

export interface IPlace {
  id:           number;
  name:         string;
  user_id:      number | null;
  direction?:   IDirection;
}


export interface IDirection {
  id:           number;
  description:  string;
  reference:    string;
  lat:          string;
  lng:          string;
  place_id:     number;
  province_id:  number;
  city_id:      number;
  province:     ICatalog;
  city:         ICatalog;
}
