# SourceAndSell iOS Deployment Configuration

## React Native Setup for iOS

To prepare the iOS version of the SourceAndSell application:

1. Set up React Native environment:
   ```bash
   npx react-native init SourceAndSellApp --template react-native-template-typescript
   ```

2. Install necessary dependencies:
   ```bash
   cd SourceAndSellApp
   npm install react-navigation react-native-vector-icons react-native-gesture-handler react-native-reanimated
   npm install @react-native-async-storage/async-storage axios
   ```

3. Configure iOS-specific settings:
   ```bash
   cd ios
   pod install
   ```

## Code Sharing Strategy

For code sharing between web and mobile:

1. Create a shared directory structure:
   ```
   /src
     /api         # Shared API calls
     /components  # Shared UI components (where possible)
     /hooks       # Shared React hooks
     /utils       # Shared utility functions
     /types       # Shared TypeScript interfaces
   ```

2. Use platform-specific imports:
   ```typescript
   // Import platform-specific components
   import { Platform } from 'react-native';
   
   const Component = Platform.OS === 'ios' 
     ? require('./ios/Component').default 
     : require('./web/Component').default;
   ```

## App Store Preparation

To prepare for App Store submission:

1. Configure app icons in `ios/SourceAndSellApp/Images.xcassets/AppIcon.appiconset`

2. Update app display name in `ios/SourceAndSellApp/Info.plist`:
   ```xml
   <key>CFBundleDisplayName</key>
   <string>SourceAndSell</string>
   ```

3. Configure app version in `ios/SourceAndSellApp/Info.plist`:
   ```xml
   <key>CFBundleShortVersionString</key>
   <string>1.0.0</string>
   <key>CFBundleVersion</key>
   <string>1</string>
   ```

4. Set up app capabilities in Xcode:
   - Enable Push Notifications
   - Configure App Groups if needed
   - Set up background modes if required

## Fastlane Setup for CI/CD

To automate iOS builds and deployments:

1. Install Fastlane:
   ```bash
   cd ios
   brew install fastlane
   fastlane init
   ```

2. Configure Fastfile for beta deployment:
   ```ruby
   lane :beta do
     increment_build_number
     build_app(scheme: "SourceAndSellApp")
     upload_to_testflight
   end
   ```

3. Configure Fastfile for App Store deployment:
   ```ruby
   lane :release do
     increment_build_number
     build_app(scheme: "SourceAndSellApp")
     upload_to_app_store(
       skip_metadata: true,
       skip_screenshots: true
     )
   end
   ```

## App Store Connect Requirements

Before submission to App Store:

1. Create an App Store Connect account
2. Create a new app in App Store Connect
3. Prepare app metadata:
   - App description
   - Keywords
   - Support URL
   - Marketing URL
   - Privacy Policy URL
4. Prepare screenshots for various device sizes
5. Complete App Privacy information

## TestFlight Distribution

For beta testing:

1. Configure TestFlight in App Store Connect
2. Add internal testers (up to 25 without review)
3. Add external testers (requires App Review)
4. Deploy using Fastlane:
   ```bash
   cd ios
   fastlane beta
   ```

## App Store Submission Checklist

Final checklist before submission:

- App icon and launch screen configured
- All required app permissions documented
- Privacy policy implemented and linked
- Terms of service documented
- Support contact information provided
- All App Store guidelines reviewed and followed
