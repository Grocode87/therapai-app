import React from "react";

const AlertContext = React.createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = React.useState({
    show: false,
    title: "",
    message: "",
    type: "",
  });

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => React.useContext(AlertContext);

export default AlertContext;
