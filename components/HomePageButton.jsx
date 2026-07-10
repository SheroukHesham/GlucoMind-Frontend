import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export const Button = ({onPress, children, variant = 'default', style}) => {
  const isOutline = variant === 'outline';
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        isOutline ? styles.outline : styles.default,
        style,
      ]}>
      <Text style={[styles.text, isOutline && styles.outlineText]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  default: {
    backgroundColor: '#4F46E5',
  },
  outline: {
    borderWidth: 2,
    borderColor: '#4F46E5',
    backgroundColor: 'transparent',
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  outlineText: {
    color: '#4F46E5',
  },
});
