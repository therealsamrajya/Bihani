export interface ButtonProps {
  title: string;
  onPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
  style?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface CircleDisplayProps {
  value: string | number;
  unit: string;
  size?: number;
  backgroundColor?: string;
  valueColor?: string;
  unitColor?: string;
  valueSize?: number;
  unitSize?: number;
  style?: ViewStyle;
}
