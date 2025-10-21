// functions/index.js
const { onCall } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

try {
  admin.app();
} catch {
  admin.initializeApp();
}

function assertAdmin(context) {
  if (!context.auth || context.auth.token.admin !== true) {
    throw new Error("permission-denied: admin only");
  }
}

exports.adminListUsers = onCall(async (req) => {
  assertAdmin(req);
  const pageToken = req.data?.pageToken || undefined;
  const res = await admin.auth().listUsers(1000, pageToken);
  const users = res.users.map((u) => ({
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
    disabled: u.disabled,
    customClaims: u.customClaims || {},
    metadata: {
      creationTime: u.metadata.creationTime,
      lastSignInTime: u.metadata.lastSignInTime,
    },
  }));
  return { users, nextPageToken: res.pageToken || null };
});

exports.adminDeleteUser = onCall(async (req) => {
  assertAdmin(req);
  const uid = req.data?.uid;
  if (!uid) throw new Error("invalid-argument: uid required");
  await admin.auth().deleteUser(uid);
  logger.info("Deleted user", { uid });
  return { ok: true };
});
