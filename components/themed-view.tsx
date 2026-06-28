import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'backgroundElement';
};

export function ThemedView({ style, lightColor, darkColor, type = 'default', ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    {
      light: lightColor ?? (type === 'backgroundElement' ? '#f1f5f9' : undefined),
      dark: darkColor ?? (type === 'backgroundElement' ? '#1f2937' : undefined),
    },
    'background'
  );

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
