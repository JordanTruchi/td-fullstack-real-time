/**
 * @file jsconfig.json creation
 * @description Generate jsconfig.json with registered module aliases for vs code, only for development
 * @see https://code.visualstudio.com/docs/languages/jsconfig
 */

const fs = require('fs'),
      { _moduleAliases: aliases } = require('./package.json');

// paths conversion
const paths = Object.entries(aliases)
                    .map(entry => entry.map(value => `${value}/*`))
                    .map(([ alias, path ]) => [ alias, [ path ] ]);

// main structure
const jsConfig = {
  compilerOptions: {
    target: 'es2020',
    baseUrl: './',
    paths: Object.fromEntries(paths)
  },
  exclude: [
    'node_modules',
    'public'
  ]
}

fs.writeFile('./jsconfig.json',
             JSON.stringify(jsConfig),
             { flag: 'w', encoding: 'utf8' },
             error => {
                if (error) {
                  console.error(error.message);
                } else {
                  console.info('jsconfig.json created successfully !');
                }
             });