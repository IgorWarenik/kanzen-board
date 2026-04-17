/**
 * afterSign hook — notarizes the .app bundle after electron-builder signs it.
 * Called automatically by electron-builder when `afterSign` is set in package.json.
 *
 * Required environment variables (set as GitHub Secrets):
 *   APPLE_ID              — your Apple ID email (e.g. dev@example.com)
 *   APPLE_APP_PASSWORD    — app-specific password from appleid.apple.com
 *   APPLE_TEAM_ID         — 10-char Team ID from developer.apple.com/account
 */

const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;

  // Only notarize on macOS
  if (electronPlatformName !== 'darwin') return;

  // Skip in local dev if SKIP_NOTARIZE=true
  if (process.env.SKIP_NOTARIZE === 'true') {
    console.log('  • Skipping notarization (SKIP_NOTARIZE=true)');
    return;
  }

  const { APPLE_ID, APPLE_APP_PASSWORD, APPLE_TEAM_ID } = process.env;

  if (!APPLE_ID || !APPLE_APP_PASSWORD || !APPLE_TEAM_ID) {
    console.warn('  • Skipping notarization — APPLE_ID / APPLE_APP_PASSWORD / APPLE_TEAM_ID not set');
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;

  console.log(`  • Notarizing ${appPath} ...`);

  await notarize({
    tool: 'notarytool',
    appBundleId: 'com.kanzenboard.app',   // must match build.appId in package.json
    appPath,
    appleId:       APPLE_ID,
    appleIdPassword: APPLE_APP_PASSWORD,
    teamId:        APPLE_TEAM_ID,
  });

  console.log('  • Notarization complete');
};
