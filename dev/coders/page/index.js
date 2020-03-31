const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const { dir, base: name } = path.parse(process.argv[2]);
const base = path.join(process.env.INIT_CWD, dir);

if (!/^([A-Z][a-z0-9]*)+$/.test(name)) {
  console.log(chalk.red('Incorrect name convention...'));
  process.exit();
}

if (fs.existsSync(path.join(base, name))) {
  console.log(chalk.red(`${path.join(base, name)} exists...`));
  process.exit();
} else {
  fs.mkdirSync(path.join(base, name), { recursive: true });
}

const files = ['index.tsx', 'fetch.ts'];

files.forEach(file => {
  fs.createWriteStream(path.join(base, name, file)).write(
    require(`./${file}.js`)(name)
  );
  console.log(chalk.green('    ' + path.join(base, name, file)));
});
console.log();
