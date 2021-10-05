import React, {useState} from "react";

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    //  A function that does nothing yet:
    login: (token) => {},
    logout: () => {}
});

export const AuthContextProvider = (props) => {

    const initialToken = localStorage.getItem('token');
    //  Could be undefined or a string:
    //  Is synchronous, so don't need a useEffect() for this.
    const [token, setToken] = useState(initialToken);

    //  This somehow changes the type of the token to a boolean, false if empty string, true if smtng.
    const userIsLoggedIn = !!token;

    const loginHandler = (token) => {
        setToken(token);
        //  local storage can only store primative data (no objects).
        localStorage.setItem('token', token);
    };

    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem('token');
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