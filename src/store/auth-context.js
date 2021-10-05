import React, {useState, useEffect, useCallback} from "react";

let logoutTimer;

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

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpirationDate = localStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if (remainingTime <= 60000) {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
    }

    return {
        token: storedToken,
        duration: remainingTime
    };
};

export const AuthContextProvider = (props) => {

    const tokenData = retrieveStoredToken();
    let initialToken;

    if (tokenData) {
        initialToken = tokenData.token;
    }
    //  Could be undefined or a string:
    //  Is synchronous, so don't need a useEffect() for this.
    const [token, setToken] = useState(initialToken);

    //  This somehow changes the type of the token to a boolean, false if empty string, true if smtng.
    const userIsLoggedIn = !!token;

    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    }, []);

    const loginHandler = (token, expirationTime) => {
        setToken(token);
        //  local storage can only store primative data (no objects).
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);

        const remainingTime = calculateRemainingTime(expirationTime);

        //  A timer that will log the user out when it's done.
        logoutTimer = setTimeout(logoutHandler, remainingTime);
        //  For testing: 3 seconds:
        //setTimeout(logoutHandler, 3000);
    };

    useEffect(() => {
        if (tokenData) {
            console.log(tokenData.duration);
            logoutTimer = setTimeout(logoutHandler, tokenData.duration);
        }
    }, [tokenData, logoutHandler]);

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;