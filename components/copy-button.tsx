"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconCopy, IconCheck } from "@tabler/icons-react";

export function CopyButton({
  text,
  className,
  variant,
}: {
  text: string;
  className?: string;
  variant?: "default" | "dark";
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === "dark") {
    return (
      <Button
        variant="default"
        size="sm"
        onClick={handleCopy}
        className={`w-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 ${className ?? ""}`}
      >
        {copied ? (
          <>
            <IconCheck className="size-4 text-green-400" />
            Copied!
          </>
        ) : (
          <>
            <IconCopy className="size-4" />
            Copy URL
          </>
        )}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleCopy}
      className={className}
    >
      {copied ? (
        <IconCheck className="size-3.5 text-green-500" />
      ) : (
        <IconCopy className="size-3.5" />
      )}
    </Button>
  );
}
