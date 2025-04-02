# SourceAndSell Android Deployment Configuration

## React Native Setup for Android

To prepare the Android version of the SourceAndSell application:

1. Ensure Android development environment is set up:
   - Install Android Studio
   - Configure Android SDK
   - Set up Android emulator or connect physical device

2. Configure React Native project for Android:
   ```bash
   # Navigate to the React Native project created in iOS setup
   cd PriceArbitrageApp
   
   # Install additional Android-specific dependencies
   npm install @react-native-community/netinfo react-native-device-info
   ```

3. Update Android-specific configurations in `android/app/build.gradle`:
   ```gradle
   android {
       defaultConfig {
           applicationId "com.sourceandsell.app"
           minSdkVersion 21
           targetSdkVersion 33
           versionCode 1
           versionName "1.0.0"
       }
   }
   ```

## Android App Icons and Splash Screen

1. Generate app icons for various densities:
   - Place icons in `android/app/src/main/res/mipmap-*` directories
   - Use Android Asset Studio or similar tools to generate icons

2. Configure splash screen in `android/app/src/main/res/values/styles.xml`:
   ```xml
   <resources>
       <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
           <item name="android:windowBackground">@drawable/splash_screen</item>
       </style>
   </resources>
   ```

## Google Play Store Preparation

1. Create a Google Play Developer account if you don't have one

2. Create a new application in Google Play Console

3. Prepare store listing materials:
   - App title and description
   - Feature graphic (1024 x 500 px)
   - Promo graphic (180 x 120 px)
   - At least 2 screenshots for each supported device type
   - Privacy policy URL

4. Configure app categorization:
   - Application type: Application
   - Category: Shopping
   - Content rating: Complete the rating questionnaire

## Signing the Android App

1. Generate a signing key:
   ```bash
   keytool -genkey -v -keystore sourceandsell-key.keystore -alias sourceandsell -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Configure signing in `android/app/build.gradle`:
   ```gradle
   android {
       signingConfigs {
           release {
               storeFile file('sourceandsell-key.keystore')
               storePassword System.getenv("KEYSTORE_PASSWORD")
               keyAlias 'sourceandsell'
               keyPassword System.getenv("KEY_PASSWORD")
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
           }
       }
   }
   ```

3. Store keystore credentials securely (never in version control)

## Fastlane Setup for Android

1. Configure Fastlane for Android:
   ```bash
   cd android
   fastlane init
   ```

2. Create a Fastfile for Android builds:
   ```ruby
   platform :android do
     desc "Build and deploy to internal testing track"
     lane :internal do
       gradle(
         task: "clean assembleRelease",
         properties: {
           "android.injected.signing.store.file" => "price-arbitrage-key.keystore",
           "android.injected.signing.store.password" => ENV["KEYSTORE_PASSWORD"],
           "android.injected.signing.key.alias" => "price-arbitrage",
           "android.injected.signing.key.password" => ENV["KEY_PASSWORD"],
         }
       )
       upload_to_play_store(
         track: 'internal',
         json_key: 'google-play-api-key.json'
       )
     end
     
     desc "Deploy to production"
     lane :production do
       gradle(
         task: "clean assembleRelease",
         properties: {
           "android.injected.signing.store.file" => "price-arbitrage-key.keystore",
           "android.injected.signing.store.password" => ENV["KEYSTORE_PASSWORD"],
           "android.injected.signing.key.alias" => "price-arbitrage",
           "android.injected.signing.key.password" => ENV["KEY_PASSWORD"],
         }
       )
       upload_to_play_store(
         track: 'production',
         json_key: 'google-play-api-key.json'
       )
     end
   end
   ```

## Google Play API Access

1. Set up Google Play API access:
   - Create a service account in Google Cloud Console
   - Generate a JSON key file
   - Grant the service account access to your Google Play Developer account

2. Store the JSON key securely for CI/CD integration

## Testing Tracks in Google Play

Configure different testing tracks for your app:

1. Internal testing:
   - Limited to up to 100 testers
   - No review required
   - Updates available in minutes

2. Closed testing:
   - For larger groups of testers
   - Requires review for first submission
   - Can create multiple closed testing tracks

3. Open testing:
   - Available to anyone who has the link
   - Requires review
   - Good for public beta testing

## Performance Optimization

1. Enable Proguard for release builds in `android/app/build.gradle`:
   ```gradle
   buildTypes {
       release {
           minifyEnabled true
           proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
       }
   }
   ```

2. Configure split APKs for different architectures:
   ```gradle
   splits {
       abi {
           enable true
           reset()
           include 'x86', 'x86_64', 'armeabi-v7a', 'arm64-v8a'
           universalApk true
       }
   }
   ```

## Google Play Store Submission Checklist

Final checklist before submission:

- App icon and splash screen configured
- All required app permissions documented in manifest
- Privacy policy implemented and linked
- Terms of service documented
- Support contact information provided
- All Google Play policies reviewed and followed
- App tested on multiple device sizes and Android versions
