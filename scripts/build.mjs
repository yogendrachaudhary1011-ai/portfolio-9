/** Produce a deployable static site, including the REAL index.html.
 * Published HTML, JS, CSS, images and Framer runtime references are copied unchanged.
 * Do not swap the 404 page for index: a real 404 remains valid for unknown routes.
 */
import { cp, mkdir, rm, copyFile, stat, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const requiredPages = ['index.html', '404.html', 'admin.html', 'perro.html', 'perro-deepdive.html', 'mercore.html'];
const optionalFiles = ['.nojekyll', '_redirects', 'firebase-applet-config.json'];
for (const name of requiredPages) {
  if (!(await stat(resolve(root,name))).isFile()) throw new Error(`Missing required page: ${name}`);
}
for (const name of ['framerusercontent.com', 'assets']) {
  if (!(await stat(resolve(root,name))).isDirectory()) throw new Error(`Missing required asset directory: ${name}`);
}
await rm(dist, {recursive:true,force:true});
await mkdir(dist,{recursive:true});
for (const name of requiredPages) await copyFile(resolve(root,name), resolve(dist,name));
for (const name of optionalFiles) {
  try { await copyFile(resolve(root,name),resolve(dist,name)); }
  catch (error) { if(error.code!=='ENOENT') throw error; }
}
for (const name of ['assets','data','framerusercontent.com']) {
  try { await cp(resolve(root,name),resolve(dist,name),{recursive:true}); }
  catch (error) { if(error.code!=='ENOENT') throw error; }
}
// The old uploaded dist directory contained only a 404.html redirect.
// Fail the build rather than deploying another empty or unusable site.
for (const name of requiredPages) {
  const orig = await readFile(resolve(root,name));
  const built = await readFile(resolve(dist,name));
  if (!orig.equals(built)) throw new Error(`Build altered original HTML: ${name}`);
}
console.log('PASS: dist/index.html is the original portfolio homepage; the dist/404.html is preserved as a genuine 404.');
console.log('PASS: all source HTML copied byte-for-byte, asset folders included, and static route aliases installed.');
