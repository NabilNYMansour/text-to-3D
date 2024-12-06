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
}

const MaterialSelect: React.FC<MaterialDropdownProps> = ({ value, onChange }) => {
  return (
    <Select defaultValue={value} onValueChange={(value) => onChange(value)}>
      <SelectTrigger>
        <SelectValue>{value}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Normal Material">Normal Material</SelectItem>
        <SelectItem value="Standard Material">Standard Material</SelectItem>
        <SelectItem value="Gradient Material">Gradient Material</SelectItem>
        <SelectItem value="Wireframe Material">Wireframe Material</SelectItem>
        <SelectItem value="Basic Material">Basic Material</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default MaterialSelect;