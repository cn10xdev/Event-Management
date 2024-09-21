import { API_URI } from "./constants";

export default function fetcher(...args) {
  args[0] = API_URI + args[0];
  args[1] = {
    ...args[1],
    credentials: "include",
  };

  return fetch(...args).then((res) => res.json());
}
