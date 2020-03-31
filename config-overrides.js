const { kebabCase } = require('lodash');
const path = require('path');
const fs = require('fs');

const {
  addWebpackResolve,
  addBabelPlugin,
  override,
} = require('customize-cra');

if (!fs.existsSync('.env.local')) {
  fs.copyFileSync('.env.production', '.env.local');
}

const { parsed: dotenv } = require('dotenv-expand')({
  parsed: [`.env.${process.env.NODE_ENV}`, '.env'].reduce((env, file) => {
    const { parse } = require('dotenv');
    return [`${file}.local`, file].reduce((env, file) => {
      if (fs.existsSync(file)) {
        return { ...parse(fs.readFileSync(file)), ...env };
      }
      return env;
    }, env);
  }, {}),
});

function pathFrom(filename) {
  for (const sep of ['/src/pages/', '/src/']) {
    if (filename.includes(sep)) {
      return pathFrom(`/${filename.split(sep)[1]}`);
    }
  }
  const { dir, name } = path.parse(filename);
  if (!name) {
    return '/';
  }
  if (['index', 'fetch'].includes(name) || dir.endsWith(`/${name}`)) {
    return pathFrom(dir);
  }
  return `${dir}/${kebabCase(name)}`.replace('//', '/');
}

const replacer = {
  ...Object.entries(dotenv).reduce((env, [key, val]) => {
    env[key] = () => val;
    return env;
  }, {}),
  ROUTER_BASENAME() {
    if (process.env.NODE_ENV === 'production') {
      const url = require('url');
      const pkg = require('./package.json');
      return url.parse(pkg.homepage).pathname;
    }
    return '/';
  },
  REPOSITORY() {
    const pkg = require('./package.json');
    if (pkg.repository && pkg.repository.url) {
      return pkg.repository.url;
    }
    return 'package.json::repository::url';
  },
  HOMEPAGE() {
    return require('./package.json').homepage || 'package.json::homepage';
  },
  VERSION() {
    return require('./package.json').version;
  },
  PAGEPATH({ filename, sourceFileName: _ }) {
    return pathFrom(filename.replace(/\\/g, '/'));
  },
  API_PATH({ filename, sourceFileName: _ }) {
    const apiPath = pathFrom(filename.replace(/\\/g, '/'));
    const prefix = dotenv.APP_API_PATH_PREFIX || '';
    return `${prefix}${apiPath}`.replace(/\/\//g, '/');
  },
  __PROD__() {
    return process.env.NODE_ENV === 'production';
  },
  __DEVE__() {
    return process.env.NODE_ENV === 'development';
  },
  __TEST__() {
    return process.env.NODE_ENV === 'test';
  },
  _glob_({ name }) {
    return name.replace(/_/g, '-').toLowerCase();
  },
};

module.exports = override(
  addBabelPlugin([require('./dev/plugins/replace'), replacer]),
  addWebpackResolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  })
);
