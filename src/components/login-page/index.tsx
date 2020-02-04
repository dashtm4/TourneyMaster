import React from 'react';
import { Auth } from 'aws-amplify';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import logo from '../../assets/logo.png';
import styles from './style.module.scss';

interface LoginPageState {
  email: string;
  password: string;
}

class LoginPage extends React.Component<RouteComponentProps, LoginPageState> {
  state: LoginPageState = {
    email: '',
    password: '',
  };

  onEmailChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    this.setState({ email: e.target.value });
  };

  onPasswordChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    this.setState({ password: e.target.value });
  };

  onSignIn = async () => {
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

  render() {
    const { email, password } = this.state;

    return (
      <main className={styles.page}>
        <h1 className="visually-hidden">Login or create account</h1>
        <section className={styles.container}>
          <form className={styles.loginForm}>
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
              />
              <span className="visually-hidden">Password</span>
            </label>
            <a className={styles.forgotPassword} href="#">
              Forgot your password?
            </a>
            <button
              className={styles.signIn}
              type="button"
              onClick={this.onSignIn}
            >
              Sign In
            </button>
          </form>
          <div className={styles.register}>
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
            <a className={styles.registerBtn} href="#">
              Sign Up
            </a>
          </div>
        </section>
      </main>
    );
  }
}

export default withRouter(LoginPage);
