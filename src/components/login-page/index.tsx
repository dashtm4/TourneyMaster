import React from 'react';
import { Auth } from 'aws-amplify';
import { RouteComponentProps, withRouter } from 'react-router-dom';
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
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.login}>
            <h4 className={styles.title}>Sign in</h4>
            <input
              type="text"
              value={email}
              onChange={this.onEmailChange}
              placeholder="Email"
            />
            <input
              type="text"
              value={password}
              onChange={this.onPasswordChange}
              placeholder="Password"
            />
            <button
              onClick={this.onForgotPassword}
              className={styles.forgotPassword}
            >
              Forgot your password?
            </button>
            <button onClick={this.onSignIn} className={styles.signIn}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(LoginPage);
