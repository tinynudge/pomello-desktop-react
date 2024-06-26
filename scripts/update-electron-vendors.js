/*eslint-env node*/
import { execSync } from 'child_process';
import electron from 'electron';
import { writeFile } from 'fs/promises';
import path from 'path';

/**
 * Returns versions of electron vendors
 * The performance of this feature is very poor and can be improved
 * @see https://github.com/electron/electron/issues/28006
 *
 * @returns {NodeJS.ProcessVersions}
 */
const getVendors = () => {
  const output = execSync(`${electron} -p "JSON.stringify(process.versions)"`, {
    env: { ELECTRON_RUN_AS_NODE: '1' },
    encoding: 'utf-8',
  });

  return JSON.parse(output);
};

const updateVendors = async () => {
  const electronRelease = getVendors();

  const nodeMajorVersion = electronRelease.node.split('.')[0];
  const chromeMajorVersion = electronRelease.v8.split('.').splice(0, 2).join('');

  const browserslistrcPath = path.resolve(process.cwd(), '.browserslistrc');

  await Promise.all([
    writeFile(
      './.electron-vendors.cache.json',
      JSON.stringify(
        {
          chrome: chromeMajorVersion,
          node: nodeMajorVersion,
        },
        null,
        2
      ) + '\n'
    ),

    writeFile(browserslistrcPath, `Chrome ${chromeMajorVersion}\n`, 'utf8'),
  ]);

  execSync(`npx browserslist --update-db`, {
    encoding: 'utf-8',
  });
};

updateVendors().catch(error => {
  console.error(error);
  process.exit(1);
});
