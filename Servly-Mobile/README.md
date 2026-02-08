# Servly Mobile - React Native App

A mobile application for finding local service providers, built with React Native and Expo.

## 🚀 Features

- **Interactive Map**: View service providers on a native map with color-coded markers
- **Location-Based Search**: Find providers near your current location
- **Category Filtering**: Filter by service categories (plumber, electrician, carpenter, etc.)
- **Provider Details**: View detailed information, ratings, and reviews
- **Direct Contact**: Call or WhatsApp providers directly from the app
- **User Authentication**: Phone-based OTP authentication
- **Provider Dashboard**: Dedicated dashboard for service providers

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac only) or Android Emulator
- Expo Go app on your physical device (optional)

## 🛠️ Installation

1. **Navigate to the project directory**:
   ```bash
   cd Servly-Mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Google Maps API Keys**:
   - Get API keys from [Google Cloud Console](https://console.cloud.google.com/)
   - Update `app.json`:
     - Replace `YOUR_ANDROID_GOOGLE_MAPS_API_KEY` with your Android key
     - Replace `YOUR_IOS_GOOGLE_MAPS_API_KEY` with your iOS key

4. **Firebase Configuration** (Already configured):
   - The app uses the same Firebase project as the web app
   - Configuration is in `src/config/firebase.js`

## 🏃 Running the App

### Start the development server:
```bash
npm start
```

### Run on specific platforms:

**Android**:
```bash
npm run android
```

**iOS** (Mac only):
```bash
npm run ios
```

**Web** (for testing):
```bash
npm run web
```

### Using Expo Go:
1. Install Expo Go on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Scan the QR code from the terminal
3. The app will open in Expo Go

## 📱 App Structure

```
Servly-Mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── SearchBar.jsx
│   │   ├── ProviderList.jsx
│   │   └── ServiceBottomSheet.jsx
│   ├── screens/             # App screens
│   │   ├── HomeScreen.jsx
│   │   ├── LoginScreen.jsx
│   │   ├── SignupScreen.jsx
│   │   ├── UserProfileScreen.jsx
│   │   └── ProviderDashboardScreen.jsx
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.jsx
│   ├── context/             # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── LocationContext.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useProviders.js
│   │   └── useReviews.js
│   ├── utils/               # Utility functions
│   │   └── distanceUtils.js
│   ├── styles/              # Styling
│   │   ├── colors.js
│   │   └── commonStyles.js
│   └── config/              # Configuration
│       └── firebase.js
├── App.js                   # Root component
├── app.json                 # Expo configuration
└── package.json             # Dependencies
```

## 🔑 Key Technologies

- **React Native**: Mobile app framework
- **Expo**: Development platform
- **React Navigation**: Navigation library
- **Firebase**: Backend (Auth, Firestore, Storage)
- **react-native-maps**: Native maps integration
- **expo-location**: Location services
- **Lucide React Native**: Icons

## ⚠️ Important Notes

### Phone Authentication
- React Native phone auth works differently than web
- You may need to configure Firebase App Check for production
- For testing, you can use Firebase test phone numbers

### Google Maps
- Android requires a Google Maps API key in `app.json`
- iOS requires a separate API key
- Make sure to enable "Maps SDK for Android" and "Maps SDK for iOS" in Google Cloud Console

### Permissions
- Location permissions are requested automatically
- Make sure to test on a real device for accurate location

## 🐛 Troubleshooting

### Maps not showing:
- Verify Google Maps API keys are correctly set in `app.json`
- Ensure Maps SDK is enabled in Google Cloud Console
- Check that billing is enabled for your Google Cloud project

### Location not working:
- Grant location permissions when prompted
- On iOS simulator, use "Features > Location > Custom Location"
- On Android emulator, use the emulator controls to set location

### Build errors:
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

## 📝 TODO

- [ ] Implement complete phone authentication flow
- [ ] Add review submission functionality
- [ ] Implement image upload for profiles
- [ ] Add push notifications
- [ ] Implement offline support
- [ ] Add analytics
- [ ] Create app store assets

## 🔗 Related

- **Web App**: Located in `../Servly`
- **Firebase Console**: [service-d19d2](https://console.firebase.google.com/)

## 📄 License

Private project for Servly
