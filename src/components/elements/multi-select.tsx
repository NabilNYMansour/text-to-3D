import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React from "react";
import { Separator } from "../ui/separator";

interface MaterialDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  otherOptions?: React.ReactNode;
}

const MultiSelect: React.FC<MaterialDropdownProps> = ({ value, onChange, options, otherOptions }) => {
  return (
    <Select defaultValue={value} onValueChange={(value) => onChange(value)}>
      <SelectTrigger>
        <SelectValue>{value}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => (
          <SelectItem key={index} value={option}>
            {option}
          </SelectItem>
        ))}
        {otherOptions && <>
          <Separator className="mt-2"/>
          <div className="grid items-center p-2">
            {otherOptions}
          </div>
        </>}
      </SelectContent>
    </Select>
  );
};

export default MultiSelect;