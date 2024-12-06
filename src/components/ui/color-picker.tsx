"use client";

import { useEffect, useState } from "react";
import { Input } from "./input";
import { useDebouncedValue } from '@mantine/hooks';

export const ColorPicker = ({ value, disabled, onChange, withTextInput = true }:
  { value: string; disabled?: boolean; onChange: (value: string) => void; withTextInput?: boolean }) => {
  const [inputValue, setInputValue] = useState(value);
  const [debouncedValue] = useDebouncedValue(inputValue, 300);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue]);

  const handleChange = (newValue: string | null) => {
    if (!newValue) {
      setInputValue("#000000");
    }
    else {
      setInputValue(newValue);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <div className={`absolute top-0 w-9 h-9 rounded-md border border-border ${disabled ? "cursor-not-allowed opacity-50" : "pointer-events-none"}`}
            style={{ backgroundColor: inputValue }} />
          <Input
            type="color"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            className={`w-9 h-9 p-0 opacity-0 cursor-pointer rounded-md ${disabled ? "pointer-events-none" : ""}`}
          />
        </div>
        {withTextInput && <Input
          disabled={disabled}
          type="text"
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-grow"
        />}
      </div>
    </div>
  );
}