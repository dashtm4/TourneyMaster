import React from 'react';
import { Auth } from 'aws-amplify';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import WithEditingForm from './hocs/withEditingForm';
import FormSignUp from './components/form-sign-up';
import FormSignIn from './components/form-sign-in';
import logo from '../../assets/logo.png';
import styles from './style.module.scss';
import './styles.scss';

interface State {
  isSignUpOpen: boolean;
}

const FormSignUpWrapped = WithEditingForm(FormSignUp);
const FormSignInWrapped = WithEditingForm(FormSignIn);

class LoginPage extends React.Component<RouteComponentProps, State> {
  constructor(props: RouteComponentProps) {
    super(props);

    this.state = {
      isSignUpOpen: false,
    };
  }

  onSignToggle = () => {
    this.setState(({ isSignUpOpen }) => ({ isSignUpOpen: !isSignUpOpen }));
  };

  onAuthSubmit = async (email: string, password: string) => {
    const user = await Auth.signIn(email, password);
    const userToken = user.signInUserSession.idToken.jwtToken;

    if (userToken) {
      localStorage.setItem('token', userToken);

      this.props.history.push('/dashboard');
    }
  };

  onRegistrationSubmit = (name: string, email: string, password: string) => {
    Auth.signUp({
      username: email,
      password,
      attributes: {
        name,
      },
    });
  };

  onGoogleSignIn = async () => {
    // const token = await Auth.federatedSignIn({ provider: 'Google' });
    // console.log(token);
  };

  onGoogleSignUp = async () => {};

  render() {
    const { isSignUpOpen } = this.state;

    return (
      <main className={styles.page}>
        <h1 className="visually-hidden">Login or create account</h1>
        <section
          className={`sign-form ${isSignUpOpen ? 'sign-form--sign-up' : ''}`}
        >
          <FormSignUpWrapped
            onRegistrationSubmit={this.onRegistrationSubmit}
            onGoogleSignUp={this.onGoogleSignUp}
          />
          <FormSignInWrapped
            onAuthSubmit={this.onAuthSubmit}
            onGoogleSignIn={this.onGoogleSignIn}
          />
          <div className="sign-form__overlay">
            <div className="sign-form__overlay-wrapper">
              <div className="sign-form__register">
                <p className={styles.logoLink}>
                  <img
                    src={logo}
                    width="200"
                    height="156"
                    alt="Tourney master logo"
                  />
                </p>
                <h2 className={styles.registerTitle}>Register now!</h2>
                <p className={styles.registerText}>
                  Enter your personal details and start your tourneys!
                </p>
                <button
                  onClick={this.onSignToggle}
                  className={styles.registerBtn}
                  type="button"
                >
                  Sign Up
                </button>
              </div>
              <div className="sign-form__register-already">
                <p className={styles.logoLink}>
                  <img
                    src={logo}
                    width="200"
                    height="156"
                    alt="Tourney master logo"
                  />
                </p>
                <h2 className={styles.registerTitle}>
                  Already have and account?
                </h2>
                <p className={styles.registerText}>
                  Sign in using your email and password
                </p>
                <button
                  onClick={this.onSignToggle}
                  className={styles.registerBtn}
                  type="button"
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
