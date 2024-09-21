import { createContext, useState, useEffect } from "react";
import useSWR from "swr";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const { data, error, mutate, revalidate } = useSWR("auth/me");

  const [value, setValue] = useState({
    loading: !data && !error,
    loggedOut: data?.error === "not authenticated",
    userData: data,
    userError: error ? error : data?.error,
    userRevalidate: mutate,
    userMutate: revalidate,
  });

  useEffect(() => {
    setValue((v) => ({
      ...v,
      loading: !data && !error,
      loggedOut: data?.error === "not authenticated",
      userData: data?.data,
      userError: error ? error : data?.error,
    }));
  }, [data, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
