const { kebabCase } = require('lodash');
const { comment } = require('..');
const path = require('path');
const fs = require('fs');

function varsComment() {
  const file = path.join(process.cwd(), 'src', '_sass', '_vars.scss');
  if (fs.existsSync(file)) {
    return ['', ...comment(file), ''];
  }
  return [''];
}

module.exports = function (name) {
  return [
    `@import '~_sass/vars';`,
    ...varsComment(),
    `.${kebabCase(name)} {`,
    `  &-main {`,
    `    // padding: 8px;`,
    `  }`,
    `}`,
    ``,
  ].join('\n');
};
