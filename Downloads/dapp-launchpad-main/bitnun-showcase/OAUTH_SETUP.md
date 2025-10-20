// OAUTH REDIRECT URIs NEEDED

## Google OAuth Setup
**Google Cloud Console**: https://console.cloud.google.com/apis/credentials
**Your Client ID**: 97930403943-ihkjbedur9aqiostq9ve4dqu7ok0fari.apps.googleusercontent.com

**Add these EXACT redirect URIs**:
```
https://www.unifiednun.com/api/auth/callback/google
```

## GitHub OAuth Setup  
**GitHub Settings**: https://github.com/settings/developers
**Your Client ID**: Ov23li7mFiXcECT1K4Sy

**Set Authorization callback URL to**:
```
https://www.unifiednun.com/api/auth/callback/github
```

## Test URLs:
- Sign In Page: https://www.unifiednun.com/auth/signin
- Google OAuth: https://www.unifiednun.com/api/auth/signin/google
- GitHub OAuth: https://www.unifiednun.com/api/auth/signin/github

## Environment Variables (Already Set):
- NEXTAUTH_URL=https://www.unifiednun.com
- GOOGLE_CLIENT_ID=97930403943-ihkjbedur9aqiostq9ve4dqu7ok0fari.apps.googleusercontent.com
- GITHUB_CLIENT_ID=Ov23li7mFiXcECT1K4Sy