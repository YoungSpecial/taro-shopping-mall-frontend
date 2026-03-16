import React from 'react';
import { View, Input as TaroInput, Text } from '@tarojs/components';
import { theme } from '../../styles/theme';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  type?: 'text' | 'number' | 'password' | 'email' | 'tel';
  disabled?: boolean;
  error?: string;
  required?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  label,
  type = 'text',
  disabled = false,
  error,
  required = false,
  prefix,
  suffix,
  style,
  inputStyle,
  className,
}) => {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    marginBottom: theme.spacing.md,
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.gray700,
  };

  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: error ? theme.colors.danger : theme.colors.gray300,
    borderRadius: theme.borderRadius.md,
    backgroundColor: disabled ? theme.colors.gray100 : theme.colors.white,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    transition: 'all 0.2s ease',
  };

  const inputBaseStyle: React.CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.gray800,
    backgroundColor: 'transparent',
    minWidth: 0,
  };

  const errorStyle: React.CSSProperties = {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.danger,
  };

  const handleChange = (e: any) => {
    onChange(e.detail.value);
  };

  return (
    <View style={containerStyle} className={className}>
      {label && (
        <Text style={labelStyle}>
          {label}
          {required && <Text style={{ color: theme.colors.danger }}> *</Text>}
        </Text>
      )}
      
      <View style={inputContainerStyle}>
        {prefix && (
          <View style={{ marginRight: theme.spacing.sm }}>{prefix}</View>
        )}
        
        <TaroInput
          value={value}
          onInput={handleChange}
          placeholder={placeholder}
          type={type as any}
          disabled={disabled}
          style={{ ...inputBaseStyle, ...inputStyle }}
          placeholderStyle={`color: ${theme.colors.gray500}`}
        />
        
        {suffix && (
          <View style={{ marginLeft: theme.spacing.sm }}>{suffix}</View>
        )}
      </View>
      
      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
};

export default Input;