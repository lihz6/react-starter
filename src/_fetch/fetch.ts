// require('es6-promise').polyfill();
// const fetch = require('isomorphic-fetch');
if (__DEVE__ && APP_ORIGIN.endsWith('/')) {
  throw Error(`Please change '${APP_ORIGIN}' to '${APP_ORIGIN.slice(0, -1)}'`);
}

export type Headers = {
  Authorization: string;
  [key: string]: string;
};

export default function <T = any>(
  path: string,
  method: string,
  data?: any,
  headers?: Headers
): Promise<T> {
  if (__PROD__ && method === 'GET') {
    path = uniqePath(path);
  }
  if (path.startsWith('/')) {
    path = `${APP_ORIGIN}${path}`;
  } else if (__DEVE__) {
    console.warn(`'${path} won't be prepend with '${APP_ORIGIN}'`);
  }
  const options = formOptions(
    {
      credentials: 'include',
      method,
    },
    data,
    headers
  );
  if (!path.startsWith(`${APP_ORIGIN}/`)) {
    options.mode = 'cors';
  }
  return fetch(path, options).then((res: Response) => {
    if (res.ok) return res.json() as Promise<T>;
    throw res.statusText;
  });
}

function formOptions(options: any, data?: any, headers?: any) {
  if (headers) {
    options.headers = headers;
  }
  if (data) {
    if (data instanceof FormData) {
      options.body = new FormData();
      for (const key in data) {
        options.body.append(key, data[key]);
      }
    } else {
      options.body = JSON.stringify(data);
      options.headers = {
        'Content-Type': 'application/json',
        ...headers,
      };
    }
  }
  return options;
}

function uniqePath(path: string) {
  if (path.indexOf('?') >= 0) {
    return path + `&_=${Date.now()}`;
  }
  return path + `?_=${Date.now()}`;
}
