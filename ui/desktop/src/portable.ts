/**
 * Portable mode. Must be the first import of main.ts.
 *
 * Pins every location Electron, Chromium, Node and child processes would otherwise resolve
 * under the OS user profile (AppData, home, temp, caches) to folders inside the install
 * folder, so the application is a self-contained drag-and-drop directory. Credentials live
 * only in `<install>/config/secrets.json`, read by the qutwo-ai backend.
 */
import { app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';

// On macOS the executable sits in <install>/Qutwo-AI.app/Contents/MacOS; the install folder is
// the one holding the .app so the signed bundle itself is never modified.
const packagedInstallDir =
  process.platform === 'darwin'
    ? path.resolve(process.execPath, '..', '..', '..', '..')
    : path.dirname(process.execPath);

const installDir = app.isPackaged
  ? packagedInstallDir
  : path.join(__dirname, '..', '..', '.portable');

const dataDir = path.join(installDir, 'data');
const homeDir = path.join(installDir, 'home');
const tmpDir = path.join(dataDir, 'tmp');
const electronDir = path.join(dataDir, 'electron');
const roamingDir = path.join(homeDir, 'AppData', 'Roaming');
const localDir = path.join(homeDir, 'AppData', 'Local');

for (const dir of [
  installDir,
  path.join(installDir, 'config'),
  dataDir,
  homeDir,
  tmpDir,
  electronDir,
  roamingDir,
  localDir,
]) {
  fs.mkdirSync(dir, { recursive: true });
}

process.env.QUTWO_AI_PATH_ROOT = installDir;
process.env.HOME = homeDir;
process.env.USERPROFILE = homeDir;
process.env.APPDATA = roamingDir;
process.env.LOCALAPPDATA = localDir;
process.env.TEMP = tmpDir;
process.env.TMP = tmpDir;
process.env.TMPDIR = tmpDir;
process.env.XDG_CONFIG_HOME = path.join(homeDir, '.config');
process.env.XDG_DATA_HOME = path.join(homeDir, '.local', 'share');
process.env.XDG_CACHE_HOME = path.join(homeDir, '.cache');
process.env.XDG_STATE_HOME = path.join(homeDir, '.local', 'state');

app.setPath('home', homeDir);
app.setPath('appData', roamingDir);
app.setPath('userData', electronDir);
app.setPath('sessionData', path.join(electronDir, 'session'));
app.setPath('temp', tmpDir);
app.setPath('logs', path.join(dataDir, 'logs'));
app.setPath('crashDumps', path.join(dataDir, 'crashes'));
app.setPath('desktop', path.join(homeDir, 'Desktop'));
app.setPath('documents', path.join(homeDir, 'Documents'));
app.setPath('downloads', path.join(homeDir, 'Downloads'));
app.commandLine.appendSwitch('disk-cache-dir', path.join(electronDir, 'cache'));

export const PORTABLE_INSTALL_DIR = installDir;
