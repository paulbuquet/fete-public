import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

/** Standard card surface (ex classe .card). */
export function Card({ className, ...props }: CardProps) {
  return <div className={cn("rounded-lg border border-gold-dim bg-card", className)} {...props} />;
}
