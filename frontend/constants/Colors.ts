/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */


const tintColorLight = '#FF69B4'; // Hot Pink
const tintColorDark = '#FFC0CB'; // Pink

export const Colors = {
  light: {
    text: '#333333',
    background: '#FFF0F5', // Lavender Blush
    tint: tintColorLight,
    icon: '#999999',
    tabIconDefault: '#C0C0C0',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF',
    background: '#4B0082', // Indigo
    tint: tintColorDark,
    icon: '#CCCCCC',
    tabIconDefault: '#A9A9A9',
    tabIconSelected: tintColorDark,
  },
};

