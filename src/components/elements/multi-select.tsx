import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MaterialDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

const MultiSelect: React.FC<MaterialDropdownProps> = ({ value, onChange, options }) => {
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
      </SelectContent>
    </Select>
  );
};

export default MultiSelect;