import { ICatalog } from "./catalog";
import { IPlace } from "./place";
import { IUser } from "./user";

export interface IEventList {
  events: IEvent[];
  total?: number;
}

export interface IEvent {
  id:               number;
  status:           boolean;
  name:             string;
  description:      string;
  img:              string;
  outstanding:      boolean;
  publish:          boolean;
  assistants:       number;
  organizer:        string;
  artist:           string;
  start_date:       Date;
  start_time:       string;
  end_date:         Date;
  end_time:         string;
  created_at:       Date;
  updated_at:       Date;
  service_id:       number;
  service:          ICatalog;
  user_id:          number;
  user:             IUser;
  place_id:         number;
  place:            IPlace;
  place_localities: ILocality [];
}

export interface ILocality {
  id:             number;
  limit_tickets:  number;
  numeration:     boolean;
  sold_tickets:   number;
  price:          number;
  event_id:       number;
  locality_id:    number;
  locality:       ICatalog;
}

export enum TypeEvents {
  Feature,
  upcoming
}
