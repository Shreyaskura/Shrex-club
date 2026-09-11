import fs from 'node:fs';
import path from 'node:path';

const CLOUD_ACTIVITY_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a08f60ec3a72d3';

function getActivityFilePath(): string {
  const dataDir = process.env.VERCEL ? '/tmp' : path.resolve(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (e) {}
  }
  const file = path.join(dataDir, 'activity_log.json');
  if (!fs.existsSync(file)) {
    try {
      fs.writeFileSync(file, '[]', 'utf-8');
    } catch (e) {}
  }
  return file;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const file = getActivityFilePath();
    let activities: any[] = [];
    if (fs.existsSync(file)) {
      try {
        activities = JSON.parse(fs.readFileSync(file, 'utf-8') || '[]');
      } catch (e) {}
    }

    let onlineEmails: string[] = [];

    // Fetch from cloud activity store
    try {
      const cloudRes = await fetch(CLOUD_ACTIVITY_URL, { headers: { 'Cache-Control': 'no-cache' } });
      if (cloudRes.ok) {
        const json = await cloudRes.json();
        const data = json?.data;
        if (data && Array.isArray(data.activities)) {
          const map = new Map<string, any>();
          for (const a of activities) map.set(a.id, a);
          for (const a of data.activities) map.set(a.id, a);
          activities = Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
        }
        if (data && data.heartbeats) {
          const now = Date.now();
          for (const [em, ts] of Object.entries(data.heartbeats)) {
            if (typeof ts === 'number' && now - ts < 180000) {
              onlineEmails.push(em.toLowerCase());
            }
          }
        }
      }
    } catch (e) {}

    if (req.method === 'GET') {
      const since = Number(req.query?.since || 0);
      const filtered = since > 0 ? activities.filter((a: any) => a.timestamp > since) : activities;
      return res.status(200).json({
        success: true,
        activities: filtered,
        onlineEmails,
        serverTime: Date.now(),
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
      const { email } = body || {};
      if (email) {
        const clean = email.toLowerCase().trim();
        try {
          const cloudRes = await fetch(CLOUD_ACTIVITY_URL, { headers: { 'Cache-Control': 'no-cache' } });
          if (cloudRes.ok) {
            const json = await cloudRes.json();
            const current = json?.data || { activities: [], heartbeats: {} };
            const heartbeats = current.heartbeats || {};
            heartbeats[clean] = Date.now();
            await fetch(CLOUD_ACTIVITY_URL, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: 'Shrex Club Activity DB',
                data: {
                  activities: current.activities || [],
                  heartbeats,
                },
              }),
            });
          }
        } catch (e) {}
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Server error', details: error?.message });
  }
}
