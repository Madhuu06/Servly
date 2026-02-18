# Email/Password Authentication Setup Guide

## ✅ Code Migration Complete!

All code has been successfully updated to use email/password authentication instead of phone/OTP.

---

## 🔧 Final Step: Enable Email/Password in Firebase Console

**You need to manually enable Email/Password authentication in Firebase Console:**

### Steps:

1. **Open Firebase Console:**
   - Go to: https://console.firebase.google.com/project/service-d19d2/authentication/providers

2. **Find Email/Password Provider:**
   - Look for "Email/Password" in the list of sign-in providers

3. **Enable It:**
   - Click on "Email/Password"
   - Toggle **"Enable"** to ON
   - Click **"Save"**

4. **Verify:**
   - You should see "Email/Password" listed as "Enabled"

---

## 🧪 Testing the Application

After enabling Email/Password authentication, test the signup and login flows:

### Test 1: Customer Signup
1. Navigate to: `http://localhost:5173/signup`
2. Select "Customer"
3. Fill in:
   - Name: Test Customer
   - Email: customer@test.com
   - Password: test123
   - Confirm Password: test123
4. Click "Continue"
5. **Expected:** Account created, redirected to home page

### Test 2: Provider Signup
1. Navigate to: `http://localhost:5173/signup`
2. Select "Service Provider"
3. Fill in:
   - Name: Test Provider
   - Email: provider@test.com
   - Password: test123
   - Confirm Password: test123
4. Click "Continue"
5. Fill in service details:
   - Service: Type "Electrician" (autocomplete will show options)
   - Description: Expert electrical services
   - Address: 123 Test Street
   - Click "Capture My Location" (allow location access)
6. Click "Create Account"
7. **Expected:** Account created, redirected to provider dashboard

### Test 3: Login
1. Navigate to: `http://localhost:5173/login`
2. Enter email and password from Test 1 or Test 2
3. Click "Sign In"
4. **Expected:** Logged in, redirected based on user type

### Test 4: Validation
- Try invalid email format → Should show error
- Try password < 6 characters → Should show error
- Try mismatched passwords → Should show error
- Try existing email → Should show "email already in use" error

---

## 📊 Verify Data in Firestore

After successful signup, check Firebase Console:

1. Go to: https://console.firebase.google.com/project/service-d19d2/firestore
2. Check `users` collection:
   - Should have documents with `email`, `name`, `userType`, etc.
3. Check `providers` collection (for provider signups):
   - Should have documents with service details

---

## 🎉 What Changed

### Before (Phone Auth):
- Phone number + OTP verification
- 3-step signup process
- Required Blaze plan (billing)
- reCAPTCHA required

### After (Email/Password):
- Email + password
- 2-step signup (1 for customers, 2 for providers)
- Completely FREE
- No reCAPTCHA needed

---

## ⚠️ Important Notes

1. **Old users with phone numbers won't work** - This is a fresh start with email/password
2. **Database field changed** - `phone` → `email` in user documents
3. **No migration needed** - Since this appears to be a new project

---

## 🐛 Troubleshooting

### "Email already in use" error
- This email is already registered
- Try logging in instead or use a different email

### "Invalid email" error
- Check email format (must be valid email address)

### "Password should be at least 6 characters" error
- Firebase requires minimum 6 character passwords

### "Passwords do not match" error
- Confirm password must match the password field

### Data not saving to Firestore
- Check Firestore rules are deployed
- Check browser console for errors
- Verify Email/Password is enabled in Firebase Console

---

## ✅ Next Steps

1. Enable Email/Password in Firebase Console (see steps above)
2. Test customer signup
3. Test provider signup  
4. Test login
5. Verify data in Firestore

Let me know if you encounter any issues!
