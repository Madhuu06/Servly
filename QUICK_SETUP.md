# Quick Firebase Console Setup Checklist

Follow these steps to complete your Firebase setup:

## 1. Enable Phone Authentication (Manual - 2 minutes)

1. Go to: https://console.firebase.google.com/project/service-d19d2/authentication/providers
2. Click on **Phone** provider
3. Toggle **Enable** → **Save**

**Optional for Testing:**
- Scroll to "Phone numbers for testing"
- Add: `+91 1234567890` with OTP: `123456`
- This lets you test without SMS costs

---

## 2. Verify Firestore Database (Manual - 1 minute)

1. Go to: https://console.firebase.google.com/project/service-d19d2/firestore
2. If database doesn't exist, click **Create database**
   - Choose **Production mode**
   - Select location: `asia-south1` (or closest to you)

---

## 3. Deploy Rules & Indexes (Using Firebase CLI)

Run these commands in your project directory:

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firestore (select existing project: service-d19d2)
firebase init firestore

# Deploy rules and indexes
firebase deploy --only firestore
```

**Alternative (Manual):**
- Copy contents of `firestore.rules` → Firebase Console → Firestore → Rules tab
- The index will auto-create when first needed

---

## 4. Test the Application

```bash
# Make sure dev server is running
npm run dev
```

Then test signup at: http://localhost:5173/signup

---

## Verification

After setup, check:
- ✅ Authentication → Users tab (will populate after first signup)
- ✅ Firestore → Data tab (will show `users` and `providers` collections)
- ✅ Firestore → Rules tab (should show your deployed rules)
- ✅ Firestore → Indexes tab (should show `providers` index)

---

**Ready to start?** Begin with Step 1 (Phone Authentication) in the Firebase Console!
