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
