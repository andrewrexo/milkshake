import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import type React from "react";
import { twMerge } from "tailwind-merge";

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  viewportClassName?: string;
}

const ScrollArea: React.FC<ScrollAreaProps> = ({ children, className, viewportClassName }) => (
  <ScrollAreaPrimitive.Root className={twMerge("overflow-hidden", className)}>
    <ScrollAreaPrimitive.Viewport
      className={twMerge("w-full h-full rounded-[inherit] pr-2.5 pb-2.5", viewportClassName)}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollAreaPrimitive.Scrollbar
      className="flex select-none touch-none p-0.5 bg-input transition-colors duration-150 ease-out hover:bg-hover data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5 rounded-full"
      orientation="vertical"
    >
      <ScrollAreaPrimitive.Thumb className="flex-1 bg-muted rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
    </ScrollAreaPrimitive.Scrollbar>
    <ScrollAreaPrimitive.Scrollbar
      className="flex select-none touch-none p-0.5 bg-input transition-colors duration-150 ease-out hover:bg-hover data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5 rounded-full"
      orientation="horizontal"
    >
      <ScrollAreaPrimitive.Thumb className="flex-1 bg-muted rounded-full relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
    </ScrollAreaPrimitive.Scrollbar>
    <ScrollAreaPrimitive.Corner className="bg-input" />
  </ScrollAreaPrimitive.Root>
);

export default ScrollArea;
