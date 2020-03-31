exports.comment = file => {
  const fs = require('fs');
  const text = fs.readFileSync(file, {
    encoding: 'utf-8',
  });

  function reduce(text, data) {
    const match = /^\/{3} *(.+)$/im.exec(text);
    if (!match) return data;
    data.push(`// ${match[1]}`);
    return reduce(text.slice(match.index + match[0].length), data);
  }

  return reduce(text, []);
};
