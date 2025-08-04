# Netlify Build & Deployment Maintenance Guide

This guide ensures smooth, repeatable, and error-free Netlify builds for your React project.

---

## ✅ 1. Lock Node Version
Prevent sudden Node upgrades that may break dependencies like `node-sass`.

In `netlify.toml`:
```toml
[build.environment]
  NODE_VERSION = "16"
```

Or in `.nvmrc`:
```
16
```

---

## ✅ 2. Keep `node-sass` Updated or Switch to Dart Sass
- If keeping `node-sass`, use `>=7.0.3` for Node 16+.
- Long-term (recommended):
```bash
npm uninstall node-sass
npm install sass --save-dev
```

---

## ✅ 3. Align Ajv + ajv-keywords Versions
- For `react-scripts@5+`:
```bash
npm install ajv@8 ajv-keywords@5 --save-dev
```
- For `react-scripts@4` or lower:
```bash
npm install ajv@6 ajv-keywords@3 --save-dev
```

---

## ✅ 4. Set Correct Publish Folder
- Create React App default:
```toml
[build]
  command = "npm run build"
  publish = "build"
```
- Only use `dist` if your build script outputs there.

---

## ✅ 5. Clear & Reinstall Dependencies When Upgrading
Whenever upgrading major packages:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## ✅ 6. Commit Lockfile
Always commit `package-lock.json` (or `yarn.lock`) so Netlify installs exactly what was tested locally.

---

## ✅ 7. Test Locally Before Deploy
Run:
```bash
npm run build
```
If it fails locally, it will fail on Netlify.

---

## ✅ 8. Watch Deprecation Warnings
Netlify may log:
```
(node:...) DeprecationWarning: ...
```
Address these early to avoid future breakage.

---

**Pro Tip:** Keep this file in your repo as `netlify-maintenance.md` so future developers have a quick reference.
