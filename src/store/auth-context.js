import React, {useState} from "react";

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    //  A function that does nothing yet:
    login: (token) => {},
    logout: () => {}
});

export const AuthContextProvider = (props) => {

    const [token, setToken] = useState(null);

    //  This somehow changes the type of the token to a boolean, false if empty string, true if smtng.
    const userIsLoggedIn = !!token;

    const loginHandler = (token) => {
        setToken(token);
    };

    const logoutHandler = () => {
        setToken(null);
    };

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;