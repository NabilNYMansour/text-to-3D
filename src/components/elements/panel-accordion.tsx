import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils";

interface PanelAccordionProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  opened?: boolean;
  onPanelChange?: (opened: boolean) => void;
}

const PanelAccordion: React.FC<PanelAccordionProps> = ({ title, children, opened, onPanelChange }) => {
  return (
    <Accordion type="single" collapsible className="w-full"
      defaultValue={opened ? "panel" : undefined}
      onValueChange={(value) => onPanelChange?.(value === "panel")}
    >
      <AccordionItem value="panel" className="border-b rounded-md">
        <AccordionTrigger
          className={
            cn("px-4 rounded-md hover:no-underline hover:cursor-pointer hover:bg-muted",
              opened ? "bg-muted rounded-b-none" : "bg-transparent")
          }
        >
          {title}
        </AccordionTrigger>
        <AccordionContent className="grid gap-2 px-2 py-2 border border-y-0 rounded-md rounded-t-none">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PanelAccordion;