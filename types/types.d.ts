import { Models } from "react-native-appwrite";

type Activities = Models.Document & {
  repCount: number;
  setCount: number;
  date: string;
  totalCount: string;
};
