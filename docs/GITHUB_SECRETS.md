# Setting Up GitHub Secrets

To securely deploy your application with Firebase credentials, you need to set up GitHub repository secrets. These secrets will be used by the GitHub Actions workflow during the build and deployment process.

## Required Secrets

Add the following secrets to your GitHub repository:

1. `NEXT_PUBLIC_FIREBASE_API_KEY`
2. `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
3. `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
4. `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
5. `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
6. `NEXT_PUBLIC_FIREBASE_APP_ID`
7. `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
8. `NEXT_PUBLIC_ADMIN_EMAIL`

## Steps to Add Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. In the left sidebar, click on "Secrets and variables" > "Actions"
4. Click "New repository secret"
5. Add each secret with the correct name and value
6. Repeat for all required secrets

## Example

To add the Firebase API key:

1. Name: `NEXT_PUBLIC_FIREBASE_API_KEY`
2. Value: `AIzaSyAZ4cdr8KZU-Z5Ohp04MzvIGLG_tGblxfE` (replace with your actual API key)
3. Click "Add secret"

## Security Notes

- Never commit your actual Firebase credentials directly in your code
- Always use environment variables or secrets for sensitive information
- Restrict access to your GitHub repository's settings
- Consider setting up Firebase security rules to restrict access to your database

Once all secrets are added, the GitHub Actions workflow will automatically use these secrets during deployment, keeping your sensitive information secure. 