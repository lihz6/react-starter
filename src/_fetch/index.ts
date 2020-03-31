import fetch, { Headers } from './fetch';

type DAO<T> = {
  code: number;
  hint: string;
  data: T;
};

const TOKEN = 'Authorization';

let Storage = [sessionStorage, localStorage].find(storage =>
  storage.getItem(TOKEN)
);

let Authorization = Storage?.getItem(TOKEN);

const destruct = <T>({ code, hint, data }: DAO<T>) => {
  if (code === 0) {
    return data;
  }
  throw hint;
};

const store = (token: string) => {
  sessionStorage.removeItem(TOKEN);
  localStorage.removeItem(TOKEN);
  Storage?.setItem(TOKEN, token);
  Authorization = token;
};

const fetcher = {
  async GET<T = any>(path: string, headers?: Headers) {
    if (!Authorization) {
      throw Error(`'${TOKEN}' required`);
    }
    const result = await fetch<DAO<T>>(path, 'GET', undefined, {
      Authorization,
      ...headers,
    });
    return destruct(result);
  },
  async POST<T = any>(path: string, data?: any, headers?: Headers) {
    if (!Authorization) {
      throw Error(`'${TOKEN}' required`);
    }
    const result = await fetch<DAO<T>>(path, 'POST', data, {
      Authorization,
      ...headers,
    });
    return destruct(result);
  },
};

export default fetcher;

export async function __signin({ remember, ...data }) {
  Storage = remember ? localStorage : sessionStorage;
  const result = await fetch(`${APP_API_PATH_PREFIX}/signin`, 'POST', data);
  return store(destruct(result));
}

export async function __forget(data: any) {
  return await fetch(`${APP_API_PATH_PREFIX}/signin`, 'POST', data).then(
    destruct
  );
}

export async function __resign() {
  return store(await fetcher.GET(`${APP_API_PATH_PREFIX}/resign`));
}

export async function __logout() {
  return Storage?.removeItem(TOKEN);
}
