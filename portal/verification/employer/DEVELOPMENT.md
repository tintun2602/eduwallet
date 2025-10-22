# Development Setup for Verification Portal

## Current Issue

The verification portal is currently trying to access Chrome extension URLs, which don't work in external browsers.

## Proper Architecture

### Production Setup:

1. **Browser Extension** → Generates URLs like `https://eduwallet.com/portal/verification/employer/verify/{credentialId}`
2. **Verification Portal** → Deployed as separate web app at `https://eduwallet.com`
3. **Server Storage** → Credentials stored server-side, not in localStorage

### Development Setup:

For local development, we need to run the verification portal separately.

## Quick Development Solution

### Option 1: Local Development Server

```bash
# Terminal 1: Run verification portal
cd portal/verification/employer
npm run dev
# Runs on http://localhost:3001

# Terminal 2: Run browser extension
cd browser-extension
npm run dev
```

### Option 2: Update URL for Local Development

Change the verification URL in `browser-extension/src/API.tsx` to:

```typescript
const verificationUrl = `http://localhost:3001/verify/${credentialId}`;
```

## Data Storage Issue

Currently using `localStorage` which only works in the same browser. For proper implementation:

1. **Development**: Use a simple JSON file or in-memory storage
2. **Production**: Use a database or secure API endpoint

## Next Steps

1. Run verification portal on localhost:3001
2. Update verification URL to use localhost
3. Implement proper data storage mechanism
