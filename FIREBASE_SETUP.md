# Firebase Setup Guide for Servly

This guide will help you set up Firebase for the Servly application so that user signup data is properly saved to the database.

## Prerequisites

- Firebase account (free tier is sufficient)
- Firebase project already created (project ID: `service-d19d2`)

---

## Step 1: Enable Phone Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **service-d19d2**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Phone** provider
5. Click **Enable** toggle
6. Click **Save**

### Optional: Add Test Phone Numbers (for development)

1. In the Phone authentication settings, scroll to **Phone numbers for testing**
2. Add test numbers (e.g., `+91 1234567890` with code `123456`)
3. This allows testing without consuming SMS quota

---

## Step 2: Set Up Firestore Database

### Create Database (if not already created)

1. Navigate to **Firestore Database** in Firebase Console
2. Click **Create database**
3. Choose **Start in production mode** (we'll add security rules next)
4. Select a location (e.g., `asia-south1` for India)
5. Click **Enable**

### Deploy Firestore Indexes

You have two options:

#### Option A: Using Firebase CLI (Recommended)

```bash
# Install Firebase CLI globally (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore in your project
firebase init firestore

# When prompted:
# - Select "Use an existing project" → service-d19d2
# - Firestore rules file: firestore.rules (press Enter)
# - Firestore indexes file: firestore.indexes.json (press Enter)

# Deploy rules and indexes
firebase deploy --only firestore
```

#### Option B: Manual Upload (via Console)

1. Go to **Firestore Database** → **Indexes** tab
2. Click **Add index**
3. Collection: `providers`
4. Add fields:
   - Field: `category`, Order: Ascending
   - Field: `rating`, Order: Descending
5. Click **Create**

---

## Step 3: Verify Security Rules

The security rules in `firestore.rules` provide:

- ✅ Users can read/write their own data
- ✅ Public read access to providers (for map display)
- ✅ Providers can update their own profiles
- ✅ Authenticated users can create reviews

**To deploy rules:**

```bash
firebase deploy --only firestore:rules
```

Or manually copy the contents of `firestore.rules` to Firebase Console → Firestore Database → Rules tab.

---

## Step 4: Test the Application

### Start Development Server

```bash
npm run dev
```

### Test Customer Signup

1. Open `http://localhost:5173/signup`
2. Select **Customer**
3. Enter:
   - Name: "Test Customer"
   - Phone: "+91 9876543210" (or your test number)
4. Click **Continue**
5. Enter OTP received via SMS (or test OTP if using test numbers)
6. Click **Create Account**

**Expected Result:**
- Redirected to home page
- Check Firebase Console → Firestore → `users` collection
- New document with your user data should appear

### Test Provider Signup

1. Open `http://localhost:5173/signup`
2. Select **Service Provider**
3. Enter basic info (different phone number)
4. Enter service details:
   - Type service name (e.g., "Electrician")
   - Add description and address
   - Capture location
5. Complete OTP verification

**Expected Result:**
- Redirected to provider dashboard
- Check Firebase Console → Firestore:
  - `users` collection: Your provider data
  - `providers` collection: Same data (for map queries)

---

## Step 5: Monitor Firebase Console

### Check Authentication

1. Go to **Authentication** → **Users** tab
2. You should see registered users with phone numbers

### Check Firestore Data

1. Go to **Firestore Database** → **Data** tab
2. Collections to verify:
   - `users`: All registered users
   - `providers`: Only service providers

### Check for Errors

1. Open browser DevTools → Console
2. Look for any Firebase errors during signup
3. Common issues:
   - reCAPTCHA not loading
   - Phone number format errors
   - OTP verification failures

---

## Troubleshooting

### Issue: "reCAPTCHA not working"

**Solution:**
- Make sure you're testing on `localhost` or a registered domain
- Check if the reCAPTCHA container exists in the DOM
- Clear browser cache and try again

### Issue: "SMS quota exceeded"

**Solution:**
- Use test phone numbers (see Step 1)
- Wait 24 hours for quota reset
- Upgrade to Blaze plan for higher limits

### Issue: "Permission denied" errors

**Solution:**
- Verify security rules are deployed
- Check if user is authenticated
- Review Firestore Rules tab for errors

### Issue: Data not saving to Firestore

**Solution:**
- Open browser console and check for errors
- Verify Firebase config in `src/config/firebase.js`
- Check if Firestore is enabled in Firebase Console
- Ensure security rules allow write access

---

## Database Structure

### `users` Collection

```javascript
{
  uid: "firebase-user-id",
  phone: "+919876543210",
  name: "User Name",
  userType: "customer" | "provider",
  createdAt: "2026-02-16T13:00:00.000Z",
  
  // Provider-specific fields (only if userType === "provider")
  category: "Electrician",
  description: "Service description",
  address: "Business address",
  latitude: 12.9716,
  longitude: 77.5946,
  rating: 0,
  reviewCount: 0,
  isVerified: false
}
```

### `providers` Collection

Same structure as `users` collection, but only contains provider documents. This is used for efficient map queries.

---

## Next Steps

Once Firebase is set up:

1. ✅ Users can sign up and their data is saved
2. ✅ Providers appear on the map
3. ✅ Authentication persists across page refreshes
4. ✅ Users can log in with existing phone numbers

You're ready to test the complete application! 🎉
