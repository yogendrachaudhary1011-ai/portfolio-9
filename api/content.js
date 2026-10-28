import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const root = process.cwd();
  const dataFile = resolve(root, 'data/content.json');

  let cfg = null;
  try {
    const cfgText = await readFile(resolve(root, 'firebase-applet-config.json'), 'utf8');
    cfg = JSON.parse(cfgText);
  } catch (e) {}

  if (req.method === 'GET' || req.method === 'HEAD') {
    if (cfg && cfg.apiKey && cfg.projectId && cfg.firestoreDatabaseId) {
      try {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${cfg.projectId}/databases/${cfg.firestoreDatabaseId}/documents/portfolio/main?key=${cfg.apiKey}`;
        const fRes = await fetch(firestoreUrl);
        if (fRes.ok) {
          const doc = await fRes.json();
          if (doc && doc.fields) {
            const liveData = fromFirestoreFields(doc.fields);
            return res.status(200).json(liveData);
          }
        }
      } catch (err) {}
    }

    try {
      const text = await readFile(dataFile, 'utf8');
      return res.status(200).json(JSON.parse(text));
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const parsed = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      try {
        await mkdir(resolve(root, 'data'), { recursive: true });
        await writeFile(dataFile, JSON.stringify(parsed, null, 2), 'utf8');
      } catch (fsErr) {}

      let cloudSaved = false;
      if (cfg && cfg.apiKey && cfg.projectId && cfg.firestoreDatabaseId) {
        try {
          const fields = {};
          for (const [k, v] of Object.entries(parsed)) {
            fields[k] = toFirestoreValue(v);
          }
          const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${cfg.projectId}/databases/${cfg.firestoreDatabaseId}/documents/portfolio/main?key=${cfg.apiKey}`;
          const fRes = await fetch(firestoreUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fields })
          });
          if (fRes.ok) cloudSaved = true;
        } catch (syncErr) {
          console.warn('Firestore sync note:', syncErr.message);
        }
      }

      return res.status(200).json({
        success: true,
        cloudSaved,
        message: cloudSaved ? 'Content saved to Cloud Firestore database.' : 'Content saved successfully.'
      });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
