/*
Migration script to move existing /sold, /reserved, /repossessed entries
into /vehicles/ using a permanent vehicleId as the key and field.

Usage:
  1. Install dependencies: npm install firebase-admin
  2. Place your Firebase service account JSON at ./serviceAccountKey.json
  3. Run: node utils/migrate_to_permanent_ids.js

Options:
  - To actually remove old collection entries after migration, set REMOVE_OLD=true

Notes:
  - The script is careful and does not delete old data by default.
  - Always back up your DB before running migration.
*/

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Missing serviceAccountKey.json in utils/. Put your service account JSON there.');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://lizaz-enterprises-ltd-default-rtdb.firebaseio.com'
});

const db = admin.database();

async function migrateCollection(collectionName, targetStatus) {
  console.log(`\nMigrating collection: /${collectionName} -> /vehicles (status=${targetStatus})`);

  const snap = await db.ref(`/${collectionName}`).once('value');
  const data = snap.val() || {};
  const keys = Object.keys(data);

  console.log(`Found ${keys.length} records in /${collectionName}`);

  for (const key of keys) {
    const record = data[key] || {};

    // Determine permanent id: prefer record.vehicleId > record.id > key
    const permanentId = (record.vehicleId || record.id || key).toString();

    // Prepare merged record
    const vehicleRef = db.ref(`/vehicles/${permanentId}`);
    const existingSnap = await vehicleRef.once('value');
    const existing = existingSnap.val() || {};

    // Ensure status is set to targetStatus
    const merged = { ...existing, ...record };
    merged.status = targetStatus;
    merged.vehicleId = permanentId;
    merged.originalId = merged.originalId || permanentId;

    // Merge or create statusHistory
    const origHistory = Array.isArray(existing.statusHistory) ? existing.statusHistory : (Array.isArray(record.statusHistory) ? record.statusHistory : []);

    // Add an entry for this status if not already recorded
    const lastEntry = origHistory.length ? origHistory[origHistory.length - 1] : null;
    const nowDate = new Date().toISOString().split('T')[0];
    const entry = {
      status: targetStatus,
      date: nowDate,
      notes: `Migrated from /${collectionName}`,
      timestamp: Date.now()
    };

    const newHistory = [...origHistory];
    // Avoid duplicating same last status
    if (!lastEntry || lastEntry.status !== targetStatus) {
      newHistory.push(entry);
    }

    merged.statusHistory = newHistory;

    // Write merged record to /vehicles/{permanentId}
    await vehicleRef.set(merged);
    console.log(`- Migrated record ${key} -> /vehicles/${permanentId}`);

    // Optionally remove original
    if (process.env.REMOVE_OLD === 'true') {
      await db.ref(`/${collectionName}/${key}`).remove();
      console.log(`  removed /${collectionName}/${key}`);
    }
  }
}

async function main() {
  try {
    // Collections to migrate: sold, reserved, repossessed
    await migrateCollection('sold', 'sold');
    await migrateCollection('reserved', 'reserved');
    await migrateCollection('repossessed', 'repossessed');

    console.log('\nMigration complete.');
    if (process.env.REMOVE_OLD !== 'true') {
      console.log('Note: old collections were not removed. To remove them set REMOVE_OLD=true');
    }
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

main();
