# EduWallet Portal

This directory contains the portal applications for EduWallet, providing different interfaces for different user types.

## Structure

- **`university/`** - University portal for managing students and academic records
- **`verification/`** - Verification portals for credential verification

## University Portal

The university portal allows universities to:

- Manage student registrations
- Add academic results and grades
- Monitor student progress
- Grant permissions to employers

## Verification Portal

The verification portal provides professional interfaces for credential verification:

### Employer Verification (`verification/employer/`)

A React-based verification interface that displays:

- University branding and logos
- Student information
- Academic records with grades
- Verification status and expiration
- Blockchain verification details

**Features:**

- Professional, recruiter-friendly design
- Time-limited access
- University-specific branding
- Mobile-responsive layout
- Secure credential display

## Development

Each portal can be developed and deployed independently:

```bash
# University Portal
cd portal/university
npm install
npm run dev

# Employer Verification Portal
cd portal/verification/employer
npm install
npm run dev
```

## Deployment

The portals are designed to be deployed as separate applications with their own build processes and deployment configurations.
