import { useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';

const AuthForm = () => {

  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    //  He decided to skip validation to focus on authentication (only letting ppl login if logged out.)
    let url;

    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAp21dduQeahByw_nPuMiRzzhYtwcWxNBc';
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAp21dduQeahByw_nPuMiRzzhYtwcWxNBc';
      //  Replace the default api key w yours:
      //fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]');
    }
      fetch(url,
      {
          method: 'POST',
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true
          }),
          headers: {
            'Content-Type': 'application/json'
          }
      }
      ).then((res) => {
        setIsLoading(false);
          if (res.ok) {
            return res.json();
          } else {
            //  This gets the error message somehow... really don't know what's going on....
            //  Async/await would also work here.
            return res.json().then(data => {
              let errorMessage = 'Authentication failed!';
              //  Makes sure the data object exists and these properties exist:
              if (data && data.error && data.error.message) {
                //  THIS is what my programming knowledge test needed! Darn.
                //  This is Firebase specific, but their API sent something similar,
                //  just needed to log the error object and see what it was.
                errorMessage = data.error.message;
              }
              throw new Error(errorMessage);
            });
          }
        })
        //  What's going on... :(
        .then(data => {
          //  Firebase has an amount of seconds in string form, converting to date here:
          //  The '+' converts data.expiresIn to a number.
          //  * 1000 converts from seconds to milliseconds.
          const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));
          //  It needs to be a string bec converting to date in auth-context.
          authCtx.login(data.idToken, expirationTime.toISOString());
          //  Unlike history.push(), this won't let u go back to prev page. Great for login/out!
          history.replace('/');
        })
        .catch(err => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
