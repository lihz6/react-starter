module.exports = function () {
  return [
    `import fetcher from '_fetch';`,
    `import resolve from '_fetch/resolve';`,
    `import { defaultParams, defaultQuery } from '.';`,
    ``,
    `export function fetchFrom({} = defaultParams, query = defaultQuery) {`,
    `  console.log('query', query);`,
    `  if (__DEVE__) {`,
    `    return resolve(true);`,
    `  }`,
    `  return fetcher.GET(\`\${API_PATH}\`);`,
    `}`,
    ``,
  ].join('\n');
};
