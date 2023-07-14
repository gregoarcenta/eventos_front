import { Place as EventPlace } from './event';
export interface ResponsePlaces {
  status:  number;
  message: null;
  data:    Place[];
}

export interface ResponsePlace {
  status:  number;
  message: null;
  data:    EventPlace;
}

export interface Place {
  id:      number;
  name:    string;
  user_id: number | null;
}
