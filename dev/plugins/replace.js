const { parseExpression } = require('@babel/parser');

// https://github.com/babel/babel/blob/master/packages/babel-parser/ast/spec.md
// https://astexplorer.net/
const parmap = {
  AssignmentExpression(path) {
    return path.parent.left === path.node;
  },
  VariableDeclarator(path) {
    return path.parent.id === path.node;
  },
  AssignmentPattern(path) {
    return path.parent.left === path.node;
  },
  MemberExpression(path) {
    // obj.key;
    // obj[KEY];
    // OBJ.key;
    return path.parent.property === path.node && !path.parent.computed;
  },
  CallExpression(path) {
    return path.parent.callee === path.node;
  },
  ObjectProperty(path) {
    // const { [KEY1]: value1, key2: value2, key3 } = {
    //   [KEY1]: VALUE1,
    //   key2: VALUE2,
    //   key3,
    // };
    const { key, value, computed } = path.parent;
    const { parent } = path.parentPath;
    return (
      (value === path.node && parent.type === 'ObjectPattern') ||
      (key === path.node && !computed)
    );
  },
};

const pararr = Object.keys(parmap).concat([
  'ExportDefaultDeclaration',
  'ConditionalExpression',
  'ExpressionStatement',
  'BinaryExpression',
  'LogicalExpression',
  'ArrayExpression',
  'TemplateLiteral',
  'UnaryExpression',
  'IfStatement',
]);

module.exports = ({ types: t }) => ({
  visitor: {
    Identifier(path, state) {
      const { name } = path.node;
      if (
        !(state.opts[name] || name.startsWith('_glob_')) ||
        !pararr.includes(path.parent.type)
      ) {
        return;
      }
      for (const type in parmap) {
        if (type === path.parent.type && parmap[type](path)) {
          return;
        }
      }
      const { filename, sourceFileName } = path.hub.file.opts;
      const value = (state.opts[name] || state.opts['_glob_'])({
        sourceFileName,
        filename,
        name,
      });

      switch (typeof value) {
        case 'undefined':
          path.node.name = 'undefined';
          break;
        case 'boolean':
          path.replaceWith(t.booleanLiteral(value));
          break;
        case 'string':
          path.replaceWith(t.stringLiteral(value));
          break;
        case 'number':
          path.replaceWith(t.numericLiteral(value));
          break;
        default:
          path.replaceWith(parseExpression(JSON.stringify(value)));
          break;
      }
    },
  },
});
