# Chrome Extension Development Setup

This setup automates the Chrome extension development workflow to avoid constantly "Loading unpacked" extensions.

## Quick Start

1. **Build the extension:**

   ```bash
   cd browser-extension
   npm run build
   ```

2. **Launch Chrome with extension loaded:**

   - Press `F5` in VS Code, or
   - Go to Run & Debug → "Launch Chrome with EduWallet Extension"

3. **Start development:**
   - The extension will be automatically loaded
   - Make changes to your code
   - Run `npm run build` to rebuild
   - Click the refresh button on the extension in Chrome

## VS Code Configuration

### Launch Configurations

- **"Launch Chrome with EduWallet Extension"** - Opens Chrome with the extension loaded
- **"Launch Chrome Extension DevTools"** - Same as above but with DevTools auto-opened

### Tasks

- **"build-extension"** - Builds the extension (runs automatically before launch)
- **"watch-extension"** - Starts Vite dev server with file watching
- **"clean-chrome-data"** - Cleans Chrome user data and cache
- **"reload-extension"** - Rebuilds and prompts to refresh

## Development Workflow

### Option 1: Manual Build & Refresh

1. Make code changes
2. Run `npm run build` in browser-extension folder
3. Click refresh button on extension in Chrome

### Option 2: Watch Mode (Recommended)

1. Run `npm run build:watch` in browser-extension folder
2. Make code changes
3. Extension rebuilds automatically
4. Click refresh button on extension in Chrome

### Option 3: VS Code Tasks

1. Use `Ctrl+Shift+P` → "Tasks: Run Task" → "build-extension"
2. Or use the integrated terminal with `npm run build`

## Chrome Configuration

The setup uses isolated Chrome instances with:

- **Extension loaded from**: `browser-extension/dist/`
- **User data directory**: `tmp/chrome-user-data/`
- **Cache directory**: `tmp/chrome-cache/`
- **Security disabled**: For development convenience

## Troubleshooting

### Extension not loading

1. Check if `dist/` folder exists and has `manifest.json`
2. Run `npm run build` to rebuild
3. Clean Chrome data: `npm run clean-chrome-data`

### Changes not reflecting

1. Rebuild: `npm run build`
2. Refresh extension in Chrome (click refresh button)
3. Or reload the extension page

### Chrome crashes or issues

1. Clean Chrome data: `npm run clean-chrome-data`
2. Restart Chrome
3. Check console for errors

## File Structure

```
browser-extension/
├── dist/                 # Built extension (auto-generated)
├── src/                  # Source code
├── public/               # Static assets
├── package.json          # Dependencies and scripts
└── vite.config.ts        # Build configuration

tmp/                      # Chrome development data (gitignored)
├── chrome-user-data/     # Chrome user profile
└── chrome-cache/         # Chrome cache
```

## Benefits

- **No manual "Load unpacked"** - Extension loads automatically
- **Isolated Chrome instance** - Won't affect your main Chrome
- **Clean development environment** - Fresh Chrome profile each time
- **Fast rebuilds** - Only rebuilds changed files
- **VS Code integration** - Debug and run from VS Code
- **Gitignored temp files** - Won't clutter your repository

## Pro Tips

1. **Use watch mode** for active development: `npm run build:watch`
2. **Keep Chrome DevTools open** for debugging
3. **Use the refresh button** on the extension instead of reloading the page
4. **Clean Chrome data** if you encounter weird issues
5. **Check the extension console** for runtime errors
