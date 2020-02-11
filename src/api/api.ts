import { Auth } from 'aws-amplify';
import axios, { AxiosResponse, AxiosError } from 'axios';

const BASE_URL = 'https://api.tourneymaster.org/v1';
const getToken = () => localStorage.getItem('token');

class Api {
  baseUrl: string;
  instance: any;

  constructor() {
    this.baseUrl = BASE_URL;

    this.instance = {};
  }

  async get(url: string, params?: any) {
    this.checkAuthToken();

    return await axios
      .create({
        baseURL: BASE_URL,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .get(url, { params })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  async post(url: string, data: any) {
    this.checkAuthToken();

    return await axios
      .create({
        baseURL: BASE_URL,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .post(url, data)
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  async put(url: string, data: any) {
    this.checkAuthToken();

    return await axios
      .create({
        baseURL: BASE_URL,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .put(url, data)
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  async delete(url: string) {
    this.checkAuthToken();

    return await axios
      .create({
        baseURL: BASE_URL,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      })
      .delete(url)
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

  private async checkAuthToken() {
    try {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const currentSession = await Auth.currentSession();

      cognitoUser.refreshSession(
        currentSession.getRefreshToken(),
        (_: any, session: any) => {
          const { idToken } = session;

          localStorage.setItem('token', idToken.jwtToken);
        }
      );
    } catch (error) {
      console.error('Unable to refresh Token', error);
    }
  }
}

export default new Api();
