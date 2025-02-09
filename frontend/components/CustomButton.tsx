import React, { FC } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface ButtonProps {
  text: string;
  onPress: () => void;
  backgroundColor?: string;
  icon?: keyof typeof AntDesign.glyphMap;
  textColor?: string;
  width?: number;
}

const CustomButton: FC<ButtonProps> = ({
  text,
  onPress,
  backgroundColor = Colors.dark.primaryButton,
  icon,
  textColor = Colors.dark.text,
  width,
}) => {
  return (
    <TouchableOpacity
    style={[
      styles.button,
      {
        backgroundColor,
        width: width ?? undefined,
        minWidth: width ? undefined : 150,
        paddingHorizontal: width ? 0 : 20,
      },
    ]}
    onPress={onPress}
  >
      {icon && <AntDesign name={icon} size={24} color={textColor} />}
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 50,
    height: 60,
  },
  text: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default CustomButton;
