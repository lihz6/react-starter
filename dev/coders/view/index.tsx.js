const { kebabCase } = require('lodash');

module.exports = function (name) {
  return [
    `import React /**, { ReactNode, ReactEventHandler } */ from 'react';`,
    `// import { Link } from 'react-router-dom';`,
    `// import { UserOutlined } from '@ant-design/icons';`,
    `// import chunk from 'lodash/chunk';`,
    `// import classlist from '_util/classlist';`,
    ``,
    `import './style.scss';`,
    ``,
    `export interface ${name}Props {`,
    `  // ...`,
    `}`,
    ``,
    `export default function ${name}({}: ${name}Props) {`,
    `  return <div className="${kebabCase(name)}-main">${name}</div>;`,
    `}`,
    ``,
  ].join('\n');
};
