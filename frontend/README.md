# MaddyApp 📱

A beautiful and intuitive list management app built with React Native and Expo. MaddyApp helps you organize your life with different types of lists including groceries, to-do items, and bucket lists.

## Features ✨

- **📝 Multiple List Types**: Create and manage groceries, to-do lists, and bucket lists
- **🎨 Beautiful UI**: Clean, modern interface with consistent purple theme
- **🔄 Real-time Updates**: Instant synchronization across all your lists
- **📱 Cross-platform**: Works on iOS, Android, and web
- **🎯 Intuitive Navigation**: Easy-to-use tab-based navigation
- **💾 Local Storage**: Your data stays on your device
- **🎨 Custom Icons**: Choose from a variety of icons for your lists

## Screenshots 📸

- **Home Screen**: Interactive pixel art interface with animated characters
- **List Management**: Create, edit, and organize your lists
- **Item Management**: Add, complete, and delete items within lists
- **Consistent Design**: Purple theme throughout the app

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd maddyApp/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your preferred platform**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## Project Structure 📁

```
frontend/
├── app/                    # Main app screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── home.tsx       # Home screen with pixel art
│   │   ├── groceries.tsx  # Groceries list
│   │   ├── todo.tsx       # To-do lists
│   │   └── bucketlist.tsx # Bucket lists
│   ├── create-module.tsx  # Create new list screen
│   ├── edit-module.tsx    # Edit list screen
│   └── module-view.tsx    # List details screen
├── components/            # Reusable components
│   ├── AnimatedListItem.tsx
│   ├── ModuleCard.tsx
│   ├── ModuleListScreen.tsx
│   └── ThemedView.tsx
├── constants/             # App constants
│   └── Colors.ts         # Color scheme
├── hooks/                # Custom React hooks
├── services/             # API and storage services
├── state/                # App state management
└── types/                # TypeScript type definitions
```

## Tech Stack 🛠️

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router with file-based routing
- **State Management**: React Context API
- **Storage**: Local storage with Expo SQLite
- **Styling**: React Native StyleSheet
- **Icons**: Expo Vector Icons (MaterialIcons)
- **Animations**: React Native Reanimated

## Development 🧑‍💻

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint

### Key Features Implementation

- **Theme Consistency**: All backgrounds use hardcoded purple (`#4B0082`) for consistent appearance across devices
- **File-based Routing**: Uses Expo Router for intuitive navigation
- **TypeScript**: Full TypeScript support for better development experience
- **Responsive Design**: Works seamlessly across different screen sizes

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Support 💬

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

Made with ❤️ using React Native and Expo
