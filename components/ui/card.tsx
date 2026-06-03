"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800",
          hover && "transition-all duration-200 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-600",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-3", className)} {...props}>{children}</div>
);

const CardTitle = ({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-lg font-semibold text-slate-900 dark:text-slate-100", className)} {...props}>{children}</h3>
);

const CardDescription = ({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props}>{children}</p>
);

export { Card, CardHeader, CardTitle, CardDescription };
export default Card;
