import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


interface PanelAccordionProps {
  title?: React.ReactNode;
  children?: React.ReactNode;
  opened?: boolean;
}

const PanelAccordion: React.FC<PanelAccordionProps> = ({ title, children, opened }) => {
  return (
    <Accordion type="single" collapsible className="w-full" defaultValue={opened ? "panel" : undefined}>
      <AccordionItem value="panel">
        <AccordionTrigger>
          {title}
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 px-2">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PanelAccordion;