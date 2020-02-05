import React from 'react';
import { Auth } from 'aws-amplify';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import logo from '../../assets/logo.png';
import styles from './style.module.scss';
import './styles.scss';

interface LoginPageState {
  email: string;
  password: string;
  isSignUpOpen: boolean;
}

class LoginPage extends React.Component<RouteComponentProps, LoginPageState> {
  state: LoginPageState = {
    email: '',
    password: '',
    isSignUpOpen: false,
  };

  onEmailChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    this.setState({ email: e.target.value });
  };

  onPasswordChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    this.setState({ password: e.target.value });
  };

  onSignIn = async (evt: React.SyntheticEvent) => {
    evt.preventDefault();

    const { email, password } = this.state;
    const user = await Auth.signIn(email, password);

    if (user.signInUserSession.idToken.jwtToken) {
      this.props.history.push('/dashboard');
    }
  };

  onForgotPassword = () => {
    return;
  };

  onGoogleSignIn = async () => {
    const token = await Auth.federatedSignIn();
    return token;
  };

  onSignToggle = () =>
    this.setState(({ isSignUpOpen }) => ({ isSignUpOpen: !isSignUpOpen }));

  render() {
    const { email, password, isSignUpOpen } = this.state;

    return (
      <main className={styles.page}>
        <h1 className="visually-hidden">Login or create account</h1>
        <section
          className={`sign-form ${isSignUpOpen ? 'sign-form--sign-up' : ''}`}
        >
          <form className="sign-form__create">
            <h2 className={styles.loginTitle}>Create Account</h2>
            <button
              type="button"
              onClick={this.onGoogleSignIn}
              className={styles.googleButton}
            >
              Sign in with Google
            </button>
            <p className={styles.accountText}>
              or use your email for registration
            </p>
            <label className={styles.accountName}>
              <input
                className={styles.emailInput}
                type="text"
                placeholder="Name"
              />
              <span className="visually-hidden">Your name</span>
            </label>
            <label className={styles.accountEmail}>
              <input type="text" placeholder="Email" />
              <span className="visually-hidden">Email Adddress</span>
            </label>
            <label className={styles.accountPassword}>
              <input
                className={styles.passwordInput}
                type="password"
                placeholder="Password"
              />
              <span className="visually-hidden">Password</span>
            </label>
            <button className={styles.signIn} type="button">
              Sign Up
            </button>
          </form>
          <form onSubmit={this.onSignIn} className="sign-form__login">
            <h2 className={styles.loginTitle}>Sign in</h2>
            <button
              type="button"
              onClick={this.onGoogleSignIn}
              className={styles.googleButton}
            >
              Sign in with Google
            </button>
            <p className={styles.accountText}>or use your account</p>
            <label className={styles.accountEmail}>
              <input
                onChange={this.onEmailChange}
                className={styles.emailInput}
                type="text"
                value={email}
                placeholder="Email"
                required
              />
              <span className="visually-hidden">Email Adddress</span>
            </label>
            <label className={styles.accountPassword}>
              <input
                onChange={this.onPasswordChange}
                className={styles.passwordInput}
                type="password"
                value={password}
                placeholder="Password"
                required
              />
              <span className="visually-hidden">Password</span>
            </label>
            <a className={styles.forgotPassword} href="#">
              Forgot your password?
            </a>
            <button className={styles.signIn} type="submit">
              Sign In
            </button>
          </form>
          <div className="sign-form__overlay">
            <div className="sign-form__overlay-wrapper">
              <div className="sign-form__register">
                <a className={styles.logoLink} href="#">
                  <img
                    src={logo}
                    width="200"
                    height="156"
                    alt="Tourney master logo"
                  />
                </a>
                <h2 className={styles.registerTitle}>Register now!</h2>
                <p className={styles.registerText}>
                  Enter your personal details and start your tourneys!
                </p>
                <button
                  onClick={this.onSignToggle}
                  className={styles.registerBtn}
                >
                  Sign Up
                </button>
              </div>
              <div className="sign-form__register-already">
                <a className={styles.logoLink} href="#">
                  <img
                    src={logo}
                    width="200"
                    height="156"
                    alt="Tourney master logo"
                  />
                </a>
                <h2 className={styles.registerTitle}>
                  Already have and account?
                </h2>
                <p className={styles.registerText}>
                  Sign in using your email and password
                </p>
                <button
                  onClick={this.onSignToggle}
                  className={styles.registerBtn}
                >
                  Sign IN
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
}

export default withRouter(LoginPage);
