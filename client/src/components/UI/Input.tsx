import React from "react";

type Props = {
  className?: string | undefined;
  type?: string | undefined;
  value?: string | number | readonly string[] | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  maxLength?: number | undefined;
};

export default function Input({
  className,
  type,
  value,
  onChange,
  maxLength,
}: Props) {
  return (
    <input
      className={`input ${className}`}
      type={type}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
    />
  );
}
