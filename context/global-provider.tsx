import React, { createContext, useContext, useEffect, useState } from "react";

import { getActivities, getCurrentUser } from "../lib/appwrite";
import { Activities } from "@/types/types";

interface GlobalContextType {
  isLogged: boolean;
  setIsLogged: React.Dispatch<boolean>;
  user: any | null;
  setUser: React.Dispatch<any | null>;
  loading: boolean;
  activities: Activities | undefined;
  fetchActivities: (date: string, user: any) => void;
}

const GlobalContext = createContext<GlobalContextType>({} as GlobalContextType);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activities>();

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setUser(res as any);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const fetchActivities = async (date: string, user: any) => {
    try {
      setLoading(true);
      const res = await getActivities(user?.$id, date);
      if (res?.total !== 0) {
        setActivities(res?.documents[0] as Activities);
      } else {
        setActivities(undefined);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        activities,
        fetchActivities,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
