import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

// @ts-ignore
window.routerHistory = history;

export default history;
