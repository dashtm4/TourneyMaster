import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const AUTH_TOKEN = localStorage.getItem('tocken');
const BASE_URL = 'https://api.tourneymaster.org/v1';

class Api {
  baseUrl: string;
  instance: AxiosInstance;

  constructor() {
    this.baseUrl = BASE_URL;

    this.instance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
  }

  async get(url: string, data?: any) {
    return await this.instance
      .get(url, { data })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  async post(url: string, data: any) {
    return await this.instance
      .post(url, data)
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  async put(url: string, data: any) {
    return await this.instance
      .put(url, data)
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  async delete(url: string) {
    return await this.instance
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
}

export default new Api();
