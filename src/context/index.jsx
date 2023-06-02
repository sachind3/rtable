import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppState = ({ children }) => {
  const [todos, setTodos] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/todos");
      setTodos(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const store = { todos, setTodos };
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};
