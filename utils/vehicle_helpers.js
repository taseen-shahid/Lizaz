import { db, ref, get, update } from '../firebase.js';

export async function setVehicleStatus(vehicleId, newStatus, extraFields = {}, note = '') {
  try {
    const vehicleRef = ref(db, `vehicles/${vehicleId}`);
    const snap = await get(vehicleRef);
    if (!snap.exists()) return false;

    const data = snap.val() || {};
    const existingHistory = Array.isArray(data.statusHistory) ? data.statusHistory : [];
    const entry = {
      status: newStatus,
      date: new Date().toISOString().split('T')[0],
      notes: note,
      timestamp: Date.now()
    };

    const updates = { status: newStatus, ...extraFields, statusHistory: [...existingHistory, entry] };

    await update(vehicleRef, updates);

    return true;
  } catch (err) {
    console.error('setVehicleStatus error', err);
    return false;
  }
}

export default setVehicleStatus;
