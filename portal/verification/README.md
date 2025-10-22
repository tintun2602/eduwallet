# Employer Verification Portal

A professional React application for displaying and verifying academic credentials shared by students with employers.

## Features

- **Professional Design**: Clean, recruiter-friendly interface
- **University Branding**: Displays university logos and branding
- **Time-Limited Access**: Credentials expire based on student settings
- **Blockchain Verification**: Shows blockchain verification status
- **Mobile Responsive**: Works on all device sizes
- **Secure Display**: Only shows verified, non-expired credentials

## URL Structure

- **Verify Credential**: `/portal/verification/employer/verify/{credentialId}`
- **Not Found**: `/portal/verification/employer/not-found`

## Components

- **`VerifyCredential`** - Main verification page
- **`CredentialNotFound`** - Error page for invalid credentials
- **`UniversityBranding`** - University logo and branding display
- **`VerificationStatus`** - Shows verification status and expiration
- **`CredentialDisplay`** - Student information display
- **`AcademicRecord`** - Academic results table

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The built files will be output to `../../dist/verification/employer/` for deployment.

## Integration

This portal integrates with the EduWallet browser extension:

1. Student generates verification URL in browser extension
2. URL contains unique credential ID
3. Credential data is stored temporarily
4. Employer visits URL to view professional verification page
5. Credential expires based on student settings
