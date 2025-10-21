const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));
try { admin.app(); } catch { admin.initializeApp({ credential: admin.credential.cert(serviceAccount) }); }


async function main() {
const [uid, flag] = process.argv.slice(2);
if (!uid || (flag !== 'true' && flag !== 'false')) {
console.error('Usage: node setAdmin.js <UID> true|false');
process.exit(2);
}
await admin.auth().setCustomUserClaims(uid, { admin: flag === 'true' });
await admin.auth().revokeRefreshTokens(uid); // why: forces fresh token next sign-in
console.log('done');
}
main().catch(e => { console.error(e); process.exit(1); });