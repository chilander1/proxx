import React from "react";
import { UseFormRegister, FieldValues, UseFormSetValue } from "react-hook-form";
import clsx from "clsx";
import styles from "./style.module.scss";

interface TProps {
  min: number;
  max?: number;
  name: string;
  label: string;
  onSetValue?: UseFormSetValue<FieldValues>;
  register: UseFormRegister<FieldValues>;
  placeholder?: string;
  isError?: boolean;
  required?: boolean;
}

const Input: React.FC<TProps> = ({
  min,
  max,
  name,
  label,
  placeholder,
  onSetValue,
  register,
  required,
  isError,
}) => {
  // Normalize input data
  const handlBlur = (e: any) => {
    if (onSetValue) {
      const val = e.target.value;

      if (val <= min) {
        onSetValue(name, min);
      }

      if (max && val >= max) {
        onSetValue(name, max);
      }
    }
  };

  return (
    <div className={clsx(styles.wrap, { [styles.error]: isError })}>
      <label htmlFor={name}>{label}</label>
      <input
        type="number"
        {...register(name, {
          required,
          min,
          max,
          onBlur: handlBlur,
        })}
        placeholder={placeholder}
        min={min}
        max={max}
      />
    </div>
  );
};

export default Input;
