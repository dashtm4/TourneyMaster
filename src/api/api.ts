import { Auth } from 'aws-amplify';
import axios, { AxiosResponse, AxiosError } from 'axios';

const BASE_URL = 'https://api.tourneymaster.org/v1';

const getToken = async () => {
  const userToken = (await Auth.currentSession()).getIdToken().getJwtToken();

  localStorage.setItem('token', userToken);

  return localStorage.getItem('token');
};

class Api {
  baseUrl: string;
  instance: any;

  constructor() {
    this.baseUrl = BASE_URL;
    this.instance = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async get(url: string, params?: any) {
    return await this.instance
      .get(url, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
        params,
      })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  async post(url: string, data: any) {
    return await this.instance
      .post(url, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
        data,
      })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  async put(url: string, data: any) {
    return await this.instance
      .put(url, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
        data,
      })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  async delete(url: string) {
    return await this.instance
      .delete(url, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  private handleResponse(response: AxiosResponse) {
    return response?.data;
  }

  private handleError(err: AxiosError) {
    // tslint:disable-next-line: no-console
    console.error('Error:', err);
  }

  // private async checkAuthToken() {
  //   try {
  //     const cognitoUser = await Auth.currentAuthenticatedUser();
  //     const currentSession = await Auth.currentSession();

  //     cognitoUser.refreshSession(
  //       currentSession.getRefreshToken(),
  //       (_: any, session: any) => {
  //         const { idToken } = session;

  //         localStorage.setItem('token', idToken.jwtToken);
  //       }
  //     );
  //   } catch (error) {
  //     console.error('Unable to refresh Token', error);
  //   }
  // }
}

export default new Api();
