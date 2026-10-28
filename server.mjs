/**
 * Minimal byte-preserving static server for the published Framer mirror.
 * No DOM, CSS, JS, animation data, or page content is touched or rewritten.
 * Google AI Studio Build uses npm run dev and discovers PORT / 0.0.0.0.
 * No npm dependencies are needed.
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat, readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
};
const pageAliases = new Map([
  ['/', '/index.html'],
  ['/index', '/index.html'],
  ['/admin', '/admin.html'],
  ['/admin.html', '/admin.html'],
  ['/perro', '/perro.html'],
  ['/perro.html', '/perro.html'],
  ['/perro-deepdive', '/perro-deepdive.html'],
  ['/perro-deepdive.html', '/perro-deepdive.html'],
  ['/mercore', '/mercore.html'],
  ['/mercore.html', '/mercore.html'],
  ['/404', '/404.html'],
  ['/about', '/index.html'],
  ['/work', '/index.html'],
  ['/projects', '/index.html'],
  ['/contact', '/index.html'],
  ['/process', '/index.html'],
  ['/experience', '/index.html'],
  ['/resume', '/assets/aistudio/Yogendra_Chaudhary_CV_cc247373.pdf'],
  ['/vedic-sewa', '/perro-deepdive.html'],
  ['/vedic-sewa.html', '/perro-deepdive.html'],
  ['/somtu', '/mercore.html'],
  ['/somtu.html', '/mercore.html'],
  ['/numira', '/perro.html'],
  ['/numira.html', '/perro.html'],
]);

function parseArgs() {
  const args = process.argv.slice(2);
  const get = flag => {
    const idx = args.indexOf(flag);
    return idx < 0 ? null : args[idx + 1];
  };
  // In Google AI Studio Build, dev server must always bind to port 3000 on 0.0.0.0.
  // Never bind to 8080 which is occupied by internal nginx ingress in this environment.
  const rawPort = get('--port') || (process.env.PORT && process.env.PORT !== '8080' ? process.env.PORT : '3000');
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    throw new Error(`Invalid port ${rawPort}`);
  }
  return { port, host: get('--host') || '0.0.0.0' };
}

async function tryServe(pathname, req, res) {
  const target = resolve(root, `.${pathname}`);
  if (target !== root && !target.startsWith(root + sep)) return false;
  try {
    const details = await stat(target);
    if (!details.isFile()) return false;
    res.writeHead(200, {
      'Content-Type': mime[extname(target).toLowerCase()] || 'application/octet-stream',
      'Content-Length': details.size,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });
    if (req.method === 'HEAD') res.end();
    else createReadStream(target).on('error', err => { console.error(err); res.destroy(err); }).pipe(res);
    return true;
  } catch (err) {
    if (err?.code === 'ENOENT' || err?.code === 'ENOTDIR') return false;
    throw err;
  }
}

function fromFirestoreValue(val) {
  if (!val) return null;
  if ('stringValue' in val) return val.stringValue;
  if ('booleanValue' in val) return val.booleanValue;
  if ('integerValue' in val) return Number(val.integerValue);
  if ('doubleValue' in val) return val.doubleValue;
  if ('arrayValue' in val) return (val.arrayValue.values || []).map(fromFirestoreValue);
  if ('mapValue' in val) return fromFirestoreFields(val.mapValue.fields);
  if ('nullValue' in val) return null;
  return null;
}

function fromFirestoreFields(fields) {
  if (!fields) return {};
  const res = {};
  for (const [key, val] of Object.entries(fields)) {
    res[key] = fromFirestoreValue(val);
  }
  return res;
}

function toFirestoreValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === 'string') return { stringValue: val };
  if (typeof val === 'boolean') return { booleanValue: val };
  if (typeof val === 'number') {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (Array.isArray(val)) {
    return { arrayValue: { values: val.map(toFirestoreValue) } };
  }
  if (typeof val === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(val)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

async function getFirestoreConfig() {
  try {
    const text = await readFile(resolve(root, 'firebase-applet-config.json'), 'utf8');
    const cfg = JSON.parse(text);
    if (cfg.apiKey && cfg.projectId && cfg.firestoreDatabaseId) return cfg;
  } catch (e) {}
  return null;
}

const server = createServer(async (req, res) => {
  const raw = (req.url || '/').split(/[?#]/)[0];
  const decoded = decodeURIComponent(raw);

  // File upload endpoint for images and videos
  if (decoded === '/api/upload') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204).end();
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body);
          const rawName = (parsed.filename || 'media').replace(/[^a-zA-Z0-9._-]/g, '_');
          const ext = extname(rawName) || '.png';
          const baseName = rawName.slice(0, rawName.length - ext.length) || 'media';
          const filename = `${Date.now()}_${baseName}${ext}`;

          let buffer;
          if (parsed.data && parsed.data.includes(',')) {
            const base64Data = parsed.data.split(',')[1];
            buffer = Buffer.from(base64Data, 'base64');
          } else if (parsed.data) {
            buffer = Buffer.from(parsed.data, 'base64');
          } else {
            throw new Error('No media data provided');
          }

          const uploadsDir = resolve(root, 'assets/uploads');
          await mkdir(uploadsDir, { recursive: true });
          const filePath = resolve(uploadsDir, filename);
          await writeFile(filePath, buffer);

          const url = `/assets/uploads/${filename}`;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, url, filename }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }
  }

  if (decoded === '/api/content') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204).end();
      return;
    }

    const dataFile = resolve(root, 'data/content.json');

    if (req.method === 'GET' || req.method === 'HEAD') {
      // 1. Try reading live from Cloud Firestore Database first
      const cfg = await getFirestoreConfig();
      if (cfg) {
        try {
          const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${cfg.projectId}/databases/${cfg.firestoreDatabaseId}/documents/portfolio/main?key=${cfg.apiKey}`;
          const fRes = await fetch(firestoreUrl);
          if (fRes.ok) {
            const doc = await fRes.json();
            if (doc && doc.fields) {
              const liveData = fromFirestoreFields(doc.fields);
              // Cache to local file in background
              writeFile(dataFile, JSON.stringify(liveData, null, 2), 'utf8').catch(() => {});
              res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
              if (req.method === 'HEAD') res.end();
              else res.end(JSON.stringify(liveData));
              return;
            }
          }
        } catch (fErr) {
          console.warn('[Firestore cloud read note]', fErr.message);
        }
      }

      // Fallback to local data file
      try {
        const text = await readFile(dataFile, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        if (req.method === 'HEAD') res.end();
        else res.end(text);
        return;
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: err.message }));
        return;
      }
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body);
          await mkdir(resolve(root, 'data'), { recursive: true });
          await writeFile(dataFile, JSON.stringify(parsed, null, 2), 'utf8');

          // Sync directly to Cloud Firestore Database
          let cloudSaved = false;
          const cfg = await getFirestoreConfig();
          if (cfg) {
            try {
              const fields = {};
              for (const [k, v] of Object.entries(parsed)) {
                fields[k] = toFirestoreValue(v);
              }
              const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${cfg.projectId}/databases/${cfg.firestoreDatabaseId}/documents/portfolio/main?key=${cfg.apiKey}`;
              const fResp = await fetch(firestoreUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fields })
              });
              if (fResp.ok) {
                cloudSaved = true;
              } else {
                const errText = await fResp.text();
                console.warn('[Firestore PATCH error]', fResp.status, errText);
              }
            } catch (syncErr) {
              console.warn('[Firestore sync error]', syncErr.message);
            }
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            cloudSaved,
            message: cloudSaved ? 'Changes permanently saved to Cloud Firestore database.' : 'Saved to database successfully.'
          }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }
  }

  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    // The browser's source HTML uses relative resource paths; keep their paths intact.
    if (!decoded.startsWith('/') || decoded.includes('\\') || decoded.includes('\0') || decoded.split('/').includes('..')) {
      res.writeHead(400).end('Invalid path');
      return;
    }
    const pathname = pageAliases.get(decoded) || decoded;
    if (await tryServe(pathname, req, res)) return;
    // An actual 404 keeps the source site's 404 markup unchanged.
    const fallback = resolve(root, '404.html');
    const details = await stat(fallback);
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': details.size, 'Cache-Control': 'no-cache' });
    if (req.method === 'HEAD') res.end();
    else createReadStream(fallback).pipe(res);
  } catch (err) {
    console.error('[portfolio-server]', err);
    if (!res.headersSent) res.writeHead(500).end('Internal server error');
    else res.destroy(err);
  }
});
const { port, host } = parseArgs();
server.listen(port, host, () => {
  console.log(`Portfolio available at http://localhost:${server.address().port}/`);
  console.log('Source Framer HTML, CSS, JS, assets, animation data and interactions are served unchanged.');
});
