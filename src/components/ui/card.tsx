import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
}

export function Card({ className, variant = "default", ...props }: CardProps) {
  const variants = {
    default: "bg-white rounded-xl border border-border",
    elevated: "bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200",
    outlined: "bg-white rounded-xl border-2 border-border",
  };

  return (
    <div className={cn(variants[variant], className)} {...props} />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-4 border-b border-border", className)} {...props} />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-4 border-t border-border", className)} {...props} />
  );
}
