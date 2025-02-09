import { ButtonProps } from "@/types";
import { Text, Pressable } from "react-native";
import React from "react";

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  backgroundColor = "bg-button",
  textColor = "text-primary",
  style,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
}) => {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={`
        px-4 
        py-4 
        rounded-lg 
        ${backgroundColor} 
        ${disabled ? "opacity-50" : "opacity-100"} 
        ${style}
        items-center 
        justify-center
      `}>
      <Text className={`text-lg font-medium ${textColor}`}>{title}</Text>
    </Pressable>
  );
};

export default Button;
