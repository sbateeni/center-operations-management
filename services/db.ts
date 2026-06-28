
export { profiles } from './profiles';
export { notesDb } from './notes-db';
export { logsApi } from './logs';
export { assignmentsApi } from './assignments';
export { campaignsApi } from './campaigns';
export { accessCodesApi } from './accessCodes';

import { notesDb } from './notes-db';
import { profiles } from './profiles';
import { logsApi } from './logs';
import { assignmentsApi } from './assignments';
import { campaignsApi } from './campaigns';
import { accessCodesApi } from './accessCodes';

export const db = {
  syncPendingNotes: notesDb.syncPending.bind(notesDb),
  verifyAccessCode: accessCodesApi.verify.bind(accessCodesApi),
  getAllNotes: notesDb.getAll.bind(notesDb),
  addNote: notesDb.add.bind(notesDb),
  deleteNote: notesDb.remove.bind(notesDb),
  getUserProfile: profiles.get.bind(profiles),
  getAllProfiles: profiles.getAll.bind(profiles),
  updateLastSeen: profiles.updateLastSeen.bind(profiles),
  createLogEntry: logsApi.create.bind(logsApi),
  getRecentLogs: logsApi.getRecent.bind(logsApi),
  clearAllLogs: logsApi.clearAll.bind(logsApi),
  createCampaign: campaignsApi.create.bind(campaignsApi),
  getActiveCampaign: campaignsApi.getActive.bind(campaignsApi),
  endCampaign: campaignsApi.end.bind(campaignsApi),
  updateCampaign: campaignsApi.update.bind(campaignsApi),
  getRecentlyActiveUsers: profiles.getRecentlyActive.bind(profiles),
  updateProfile: profiles.update.bind(profiles),
  createAssignment: assignmentsApi.create.bind(assignmentsApi),
  getMyAssignments: assignmentsApi.getMy.bind(assignmentsApi),
  updateAssignmentStatus: assignmentsApi.updateStatus.bind(assignmentsApi),
  createAccessCode: accessCodesApi.create.bind(accessCodesApi),
  getMyAccessCodes: accessCodesApi.getMine.bind(accessCodesApi),
  revokeAccessCode: accessCodesApi.revoke.bind(accessCodesApi),
  renewAccessCode: accessCodesApi.renew.bind(accessCodesApi),
  getAllAccessCodes: accessCodesApi.getAll.bind(accessCodesApi),
};
