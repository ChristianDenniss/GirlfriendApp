import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: 'FredokaRegular',
  },
  defaultSemiBold: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: 'FredokaRegular',
  },
  title: {
    fontSize: 36,
    lineHeight: 40,
    fontFamily: 'FredokaRegular',
  },
  subtitle: {
    fontSize: 24,
    fontFamily: 'FredokaRegular',
  },
  link: {
    lineHeight: 30,
    fontSize: 18,
    fontFamily: 'FredokaRegular',
    color: '#FF69B4',
  },
});
