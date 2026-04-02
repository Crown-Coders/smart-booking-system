import { Platform, ViewStyle } from 'react-native';

export const shadowStyle = (options: {
  color?: string;
  offsetX?: number;
  offsetY?: number;
  opacity?: number;
  radius?: number;
  elevation?: number;
}): ViewStyle => {
  const { color = '#000', offsetX = 0, offsetY = 2, opacity = 0.05, radius = 8, elevation = 2 } = options;
  
  if (Platform.OS === 'web') {
    return {
      boxShadow: `${offsetX}px ${offsetY}px ${radius}px rgba(0, 0, 0, ${opacity})`,
    };
  }
  
  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
};