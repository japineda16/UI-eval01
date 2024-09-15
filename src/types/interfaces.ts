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
