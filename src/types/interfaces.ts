export interface Root {
  results: UserProfile[];
  info?: Info;
}

export interface UserProfile {
  gender: string;
  name: Name;
  location: Location;
  email: string;
  login?: Login;
  dob: Dob;
  phone: string;
  id: number;
  picture: Picture | string;
  nat: string;
  userId?: string;
}

export interface Name {
  title: string;
  first: string;
  last: string;
}

export interface Location {
  street: string;
  city: string;
  state: string;
  country: string;
  postcode: number;
  coordinates: Coordinates;
  timezone: string;
}

export interface Coordinates {
  latitude: string;
  longitude: string;
}

export interface Login {
  uuid: string;
  username: string;
}

export interface Dob {
  date: string;
  age: number;
}

export interface Picture {
  large: string;
  medium: string;
  thumbnail: string;
}

export interface Info {
  seed: string;
  results: number;
  page: number;
  version: string;
}

export interface FormTimes {
  email: number;
  password: number;
}

export interface LocationResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  class: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: AddressResponse;
  boundingbox: string[];
}

export interface AddressResponse {
  city: string;
  municipality: string;
  county: string;
  state: string;
  "ISO3166-2-lvl4": string;
  postcode: string;
  country: string;
  country_code: string;
}
