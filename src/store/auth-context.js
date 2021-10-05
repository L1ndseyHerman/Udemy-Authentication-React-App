import React, {useState} from "react";

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    //  A function that does nothing yet:
    login: (token) => {},
    logout: () => {}
});

const calculateRemainingTime = (expirationTime) => {
    //  Gets the current time in milliseconds:
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();

    const remainingDuration = adjExpirationTime - currentTime;

    return remainingDuration;
};

export const AuthContextProvider = (props) => {

    const initialToken = localStorage.getItem('token');
    //  Could be undefined or a string:
    //  Is synchronous, so don't need a useEffect() for this.
    const [token, setToken] = useState(initialToken);

    //  This somehow changes the type of the token to a boolean, false if empty string, true if smtng.
    const userIsLoggedIn = !!token;

    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    const loginHandler = (token, expirationTime) => {
        setToken(token);
        //  local storage can only store primative data (no objects).
        localStorage.setItem('token', token);

        const remainingTime = calculateRemainingTime(expirationTime);

        //  A timer that will log the user out when it's done.
        setTimeout(logoutHandler, remainingTime);
        //  For testing: 3 seconds:
        //setTimeout(logoutHandler, 3000);
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