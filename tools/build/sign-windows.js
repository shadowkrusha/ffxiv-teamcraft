// Source: https://github.com/ShabadOS/desktop/pull/266/files

const { execSync } = require('child_process');

const {
  SIGN_TOOL_PATH = 'C:\\Program Files (x86)\\Windows Kits\\10\\bin\\x64\\signtool.exe',
  TIMESTAMP_SERVER = 'http://timestamp.digicert.com'
} = process.env;

const SITE = 'https://ffxivteamcraft.com';

const importPfx = (certPath, password) => {
  const command = [
    ['certutil'],
    ['-f'],
    ['-p', `"${password}"`],
    ['-importPfx', 'My', `"${certPath}"`, 'NoRoot']
  ].map(sub => sub.join(' ')).join(' ');

  try {
    execSync(command, { stdio: 'inherit' });
  } catch {
    console.error('Unable to import certificate');
  }
};

const signBinary = (path, name) => {
  const command = [
    [`"${SIGN_TOOL_PATH}"`],
    ['sign'],
    ['/a'],
    ['/s', 'My'],
    ['/sm'],
    ['/t', `"${TIMESTAMP_SERVER}"`],
    ['/d', `"${name}"`],
    ['/du', `"${SITE}"`],
    [`"${path}"`]
  ].map(sub => sub.join(' ')).join(' ');

  try {
    execSync(command, { stdio: 'inherit' });
  } catch {
    console.error(`Signing ${path} failed`);
  }
};

exports.default = ({ path, name, cscInfo: { file, password } = {} }) => {
  if (!file) return;

  importPfx(file, password);
  signBinary(path, name, file);
};
