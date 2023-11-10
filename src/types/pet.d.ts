import { Plan } from "./plan";

export interface Pet {
  id: string;
  avatar: string;
  name: string;
  age: string;
  sex: string;
  color: string;
  category: string;
  weight: string;
  plans: Array<Plan>;
}
