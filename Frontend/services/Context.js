import { createContext, useState } from 'react';

const Context = createContext();

export const Provider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});
  const [gmailResetContrasena, setGmailResetContrasena] = useState("");
  const [usersList, setUsersList] = useState([]); // Nueva variable para almacenar una lista de objetos

  return (
    <Context.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        gmailResetContrasena,
        setGmailResetContrasena,
        usersList,
        setUsersList, // Permite modificar la lista
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;

