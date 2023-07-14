import { DataCatalog } from "./catalogs";

export interface ResponseUploadImage {
  status:  number;
  message: string;
  data:    string;
}

export interface ResponseEvents {
  status:  number;
  message: null;
  data:    Event[];
}

export interface ResponseEvent {
  status:  number;
  message: null;
  data:    Event;
}

export interface Event {
  id:          number;
  status:      boolean;
  name:         string;
  description:  string;
  img:          string;
  outstanding:  boolean;
  assistants:  number;
  organizer:    string;
  artist:       string;
  start_date:   Date;
  start_time:   string;
  end_date:     Date;
  end_time:     string;
  created_at:  Date;
  updated_at:  Date;
  place_id:     number;
  service_id:   number;
  place:       Place;
  place_localities: PlaceLocality[];
  service:     DataCatalog;
}

export interface Place {
  id:       number;
  name:      string;
  user_id:   number;
  direction: Direction;
}

export interface Direction {
  id:          number;
  description: string;
  reference:   string;
  lat:         string;
  lng:         string;
  place_id:    number;
  province_id: number;
  city_id:     number;
  province:    DataCatalog;
  city:        DataCatalog;
}

export interface PlaceLocality {
  id:            number;
  limit_tickets: number;
  numeration:    boolean;
  sold_tickets:  number;
  price:         number;
  locality_id:   number;
  event_id:      number;
  locality:      DataCatalog;
}
