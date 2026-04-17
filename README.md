# Kaizen Board

Minimalist Kaizen/Kanban board for macOS — built with Electron.

## Development

```bash
npm install
npm start
```

## Build signed & notarized DMG

Every push to `master` triggers GitHub Actions which:
1. Installs dependencies
2. Signs the `.app` with your Developer ID certificate
3. Notarizes via Apple's `notarytool`
4. Uploads the `.dmg` + `.zip` as a workflow artifact (kept 30 days)

### One-time setup: GitHub Secrets

Go to **Settings → Secrets and variables → Actions → New repository secret** and add the five secrets below.

---

#### 1. `CSC_CONTENT` — Developer ID certificate (base64)

On your Mac:

```bash
# Export "Developer ID Application: ..." from Keychain Access as .p12
# Then encode it:
base64 -i ~/Desktop/certificate.p12 | pbcopy
```

Paste the clipboard content as the secret value.

#### 2. `CSC_KEY_PASSWORD` — password you set when exporting the .p12

#### 3. `APPLE_ID` — your Apple ID email

e.g. `dev@example.com`

#### 4. `APPLE_APP_PASSWORD` — app-specific password

Generate at [appleid.apple.com](https://appleid.apple.com) →
**Sign-In and Security → App-Specific Passwords**.

#### 5. `APPLE_TEAM_ID` — 10-character Team ID

Find it at [developer.apple.com/account](https://developer.apple.com/account) →
top-right corner next to your team name, e.g. `AB12CD34EF`.

---

### Skip notarization locally

```bash
SKIP_NOTARIZE=true npm run build
```

---

## Publish a release

Every push to `master` builds and stores the DMG as a workflow artifact.
To publish a public GitHub Release with a download link:

```bash
# Bump version in package.json first, then:
git tag v1.0.1
git push origin v1.0.1
```

GitHub Actions will build, sign, notarize and attach the `.dmg` + `.zip`
to a new Release at **Releases → v1.0.1** automatically.
Release notes are generated from commit messages.
