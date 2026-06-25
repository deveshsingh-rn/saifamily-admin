export interface Experience {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string; // Or Date if you prefer to parse it
  image: string;
  createdAt: string;
}