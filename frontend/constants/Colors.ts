/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#FF69B4'; // Hot Pink
const tintColorDark = '#FFC0CB'; // Pink

// Consistent background color for all themes - always purple
const CONSISTENT_BACKGROUND = '#4B0082'; // Original purple

export const Colors = {
  light: {
    text: '#333333',
    background: CONSISTENT_BACKGROUND,
    tint: tintColorLight,
    icon: '#999999',
    tabIconDefault: '#C0C0C0',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: CONSISTENT_BACKGROUND, // Same as light mode
    tint: tintColorDark,
    icon: '#CCCCCC',
    tabIconDefault: '#A9A9A9',
    tabIconSelected: tintColorDark,
  },
};

