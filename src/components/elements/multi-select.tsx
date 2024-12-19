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
  secondaryOptions?: string[];
}

const MultiSelect: React.FC<MaterialDropdownProps> = ({ value, onChange, options, secondaryOptions }) => {
  return (
    <Select defaultValue={value} value={value} onValueChange={(value) => onChange(value)}>
      <SelectTrigger className="overflow-hidden">
        <SelectValue>{value}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => (
          <SelectItem key={index} value={option}>
            {option}
          </SelectItem>
        ))}
        {secondaryOptions && secondaryOptions.length > 0 && <>
          <Separator className="my-2" />
          {secondaryOptions.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </>}
      </SelectContent>
    </Select>
  );
};

export default MultiSelect;