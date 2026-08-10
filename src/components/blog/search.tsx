"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

type BlogSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function BlogSearch({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: BlogSearchProps) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center",
        className
      )}
    >
      <Search
        className="
          absolute
          left-3
          h-4
          w-4
          text-muted-foreground
        "
      />

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="
            absolute
            right-1
            h-8
            w-8
          "
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}