import React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Auth, Hub } from 'aws-amplify';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth/lib/types';
import { createMemeber } from './logic/action';
import WithEditingForm from './hocs/withEditingForm';
import FormSignUp from './components/form-sign-up';
import FormSignIn from './components/form-sign-in';
import { BindingCbWithTwo } from 'common/models/callback';
import { Toasts } from '../common';
import logo from '../../assets/logo.png';
import styles from './style.module.scss';
import './styles.scss';

interface Props {
  createMemeber: BindingCbWithTwo<string, string>;
}

interface State {
  isSignUpOpen: boolean;
}

const FormSignUpWrapped = WithEditingForm(FormSignUp);
const FormSignInWrapped = WithEditingForm(FormSignIn);

class LoginPage extends React.Component<Props & RouteComponentProps, State> {
  constructor(props: Props & RouteComponentProps) {
    super(props);

    this.state = {
      isSignUpOpen: false,
    };
  }

  componentDidMount() {
    const { createMemeber } = this.props;

    Hub.listen('auth', async ({ payload: { event } }) => {
      try {
        switch (event) {
          case 'signIn':
            const currentSession = await Auth.currentSession();
            const userToken = currentSession.getAccessToken().getJwtToken();
            const userAttributes = currentSession.getIdToken().payload;

            if (userToken) {
              localStorage.setItem('token', userToken);

              createMemeber(userAttributes.name, userAttributes.email);

              this.props.history.push('/dashboard');
            }
        }
      } catch (err) {
        Toasts.errorToast(`${err.message}`);
      }
    });
  }

  onSignToggle = () => {
    this.setState(({ isSignUpOpen }) => ({ isSignUpOpen: !isSignUpOpen }));
  };

  onAuthSubmit = async (email: string, password: string) => {
    try {
      await Auth.signIn(email, password);
    } catch (err) {
      Toasts.errorToast(`${err.message}`);
    }
  };

  onRegistrationSubmit = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          name: fullName,
        },
      });
    } catch (err) {
      Toasts.errorToast(`${err.message}`);
    }
  };

  onGoogleLogin = async () => {
    try {
      await Auth.federatedSignIn({
        provider: CognitoHostedUIIdentityProvider.Google,
      });
    } catch (err) {
      Toasts.errorToast(`${err.message}`);
    }
  };

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
            onGoogleLogin={this.onGoogleLogin}
          />
          <FormSignInWrapped
            onAuthSubmit={this.onAuthSubmit}
            onGoogleLogin={this.onGoogleLogin}
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

export default connect(null, (dispatch: Dispatch) =>
  bindActionCreators({ createMemeber }, dispatch)
)(withRouter(LoginPage));
