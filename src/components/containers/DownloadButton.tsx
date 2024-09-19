import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="w-full flex text-sm py-1">
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            className="scale-150"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
          &nbsp;&nbsp;Download Data
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Download Data</h4>
            <p className="text-sm text-muted-foreground">
              Download the selected data as a CSV file.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline">
              <div className="flex flex-col text-sm">
                <h1>Entire Country</h1>
                <p className="text-xs text-muted-foreground font-light">1.5MB</p>
              </div>
            </Button>
            <Button variant="outline">
              <div className="flex flex-col text-sm">
                <h1>Selected Counties Only</h1>
                <p className="text-xs text-muted-foreground font-light">29KB</p>
              </div>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
