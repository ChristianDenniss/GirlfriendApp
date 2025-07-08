# 🍎 App Store Publishing Guide for MaddyApp

This guide covers everything you need to publish MaddyApp to the Apple App Store.

## 📋 Quick Overview

**MaddyApp** is a productivity app made for my gf and I that helps users organize:
- **Groceries**: Shopping lists and meal planning
- **Todo**: Daily tasks and reminders  
- **Bucket List**: Life goals and dreams

## 💰 Costs & Timeline

### Costs
- **Apple Developer Account**: $99/year (required)
- **EAS Build**: Free tier available
- **Total**: ~$99/year

### Timeline
- **Setup**: 1-2 weeks
- **Review**: 1-7 days (usually 24-48 hours)
- **Total**: 2-3 weeks from start to approval

## 🔧 Technical Setup

### 1. Apple Developer Account
1. Go to [developer.apple.com](https://developer.apple.com)
2. Sign up for Apple Developer Program ($99/year)
3. Complete enrollment process

### 2. App Store Connect Setup
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Create new app record
3. Configure app metadata

### 3. Update App Configuration

Your `app.json` has been updated with required iOS settings:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.christiandennis.maddyapp",
      "buildNumber": "1",
      "infoPlist": {
        "NSAppTransportSecurity": {
          "NSAllowsArbitraryLoads": true
        },
        "CFBundleDisplayName": "MaddyApp",
        "CFBundleName": "MaddyApp"
      }
    }
  }
}
```

**✅ Bundle Identifier**: `com.christiandennis.maddyapp` (already configured)

### 4. EAS Configuration

The `eas.json` file has been created. Update these values:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-store-connect-app-id", 
        "appleTeamId": "your-apple-team-id"
      }
    }
  }
}
```

## 📱 Required Assets

### App Icon
- **Size**: 1024x1024 pixels
- **Format**: PNG
- **Requirements**: 
  - No transparency
  - No rounded corners (Apple adds them)
  - Clear, recognizable design

### App Store Screenshots

#### iPhone Screenshots (Required)
- **6.7" iPhone**: 1290 x 2796 pixels
- **6.5" iPhone**: 1242 x 2688 pixels  
- **5.5" iPhone**: 1242 x 2208 pixels

#### iPad Screenshots (Optional but recommended)
- **12.9" iPad Pro**: 2048 x 2732 pixels
- **11" iPad Pro**: 1668 x 2388 pixels

#### Screenshot Content
Show these key features:
1. **Home screen** with animated characters
2. **Groceries module** with sample items
3. **Todo module** with tasks
4. **Bucket List module** with goals
5. **Module creation/editing**

### App Store Listing Content

#### App Name
- **Current**: "MaddyApp"
- **Max**: 30 characters
- **Status**: ✅ Good

#### Subtitle (Optional but recommended)
- **Suggestion**: "Organize life with style"
- **Max**: 30 characters

#### Description
```
MaddyApp is your personal organization companion, designed to make managing your daily life both fun and efficient.

🎯 FEATURES:
• Groceries: Create shopping lists, organize by categories, and never forget essentials
• Todo: Track daily tasks, set priorities, and stay on top of your responsibilities  
• Bucket List: Document your dreams and life goals with beautiful organization

✨ WHAT MAKES US SPECIAL:
• Beautiful pixel art animations that bring your lists to life
• Intuitive interface designed for effortless organization
• Local storage keeps your data private and secure
• Works offline - no internet required
• Haptic feedback for satisfying interactions

Perfect for anyone who wants to:
• Stay organized without the complexity
• Add a touch of fun to daily planning
• Keep personal goals and dreams in one place
• Manage shopping and tasks efficiently

Download MaddyApp today and transform how you organize your life!
```

#### Keywords
- **Suggestion**: "organizer,list,todo,groceries,bucket,goals,productivity"
- **Max**: 100 characters

#### Category
- **Primary**: Productivity
- **Secondary**: Lifestyle

#### Age Rating
- **Recommended**: 4+
- **Reason**: No mature content, suitable for all ages

## 🔒 Privacy & Legal Requirements

### Privacy Policy (REQUIRED)

Create a file at `PRIVACY_POLICY.md`:

```markdown
# Privacy Policy for MaddyApp

**Last updated**: [Date]

## Data Collection
MaddyApp does not collect, store, or transmit any personal data to external servers.

## Data Storage
All app data is stored locally on your device using SQLite database.

## Third-Party Services
MaddyApp does not use any third-party analytics, advertising, or tracking services.

## Data Sharing
We do not share any user data with third parties.

## Contact
For privacy questions, contact: [your-email@example.com]
```

**Hosting Options:**
1. **GitHub Pages**: Free, easy setup
2. **Your website**: If you have one
3. **Privacy policy generators**: Create professional policy

### App Privacy Details (App Store Connect)
- **Data Collection**: No
- **Data Usage**: N/A
- **Data Sharing**: No

## 🚀 Build & Submit Process

### 1. Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure EAS (if not done)
```bash
eas build:configure
```

### 4. Build for Production
```bash
eas build --platform ios --profile production
```

### 5. Submit to App Store
```bash
eas submit --platform ios --profile production
```

## ✅ Pre-Submission Checklist

### Technical Requirements
- [ ] App runs without crashes
- [ ] All features work as expected
- [ ] App icon meets requirements (1024x1024)
- [ ] Bundle identifier is unique
- [ ] App version and build number set correctly

### Content Requirements
- [ ] Screenshots for all required device sizes
- [ ] App description written and reviewed
- [ ] Keywords selected
- [ ] Category chosen
- [ ] Age rating determined

### Legal Requirements
- [ ] Privacy policy created and hosted
- [ ] Privacy policy URL ready for App Store Connect
- [ ] App privacy details configured

### App Store Connect Setup
- [ ] App record created
- [ ] Metadata entered
- [ ] Screenshots uploaded
- [ ] App information complete

## 🚫 Common Rejection Reasons

### Technical Issues
- **App crashes during review**
- **Poor performance or slow loading**
- **Incomplete functionality**
- **Broken links or features**

### Content Issues
- **Missing privacy policy**
- **Inappropriate content**
- **Misleading app description**
- **Poor quality screenshots**

### Metadata Issues
- **Incorrect app category**
- **Missing required information**
- **Inappropriate keywords**

## 🔄 After Submission

### Review Process
1. **Submitted**: App enters review queue
2. **In Review**: Apple reviews your app (1-7 days)
3. **Approved**: App goes live on App Store
4. **Rejected**: Fix issues and resubmit

### If Rejected
1. Read rejection reason carefully
2. Fix the specific issues mentioned
3. Update app version and build number
4. Resubmit with fixes

## 📈 Post-Launch

### App Store Optimization
- Monitor app performance
- Gather user feedback
- Update app regularly
- Respond to reviews

### Analytics (Optional)
Consider adding analytics to track:
- App usage patterns
- Feature popularity
- User retention

## 🆘 Getting Help

### Resources
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Expo Documentation](https://docs.expo.dev/)
- [EAS Documentation](https://docs.expo.dev/eas/)

### Support
- Apple Developer Support: [developer.apple.com/contact](https://developer.apple.com/contact)
- Expo Support: [expo.canny.io](https://expo.canny.io)

## 📝 Next Steps

1. ✅ **Bundle identifier configured**: `com.christiandennis.maddyapp`
2. **Create Apple Developer account**
3. **Set up App Store Connect**
4. **Prepare screenshots**
5. **Create privacy policy**
6. **Test app thoroughly**
7. **Build and submit**

---

**Good luck with your App Store submission! 🍀** 