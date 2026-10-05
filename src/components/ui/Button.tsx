import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Shared gold call-to-action (ex classe .btn-gold). Per-usage size tweaks via className. */
export function Button({ className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "cursor-pointer rounded-md border-0 bg-[linear-gradient(135deg,#c9a84c,#a07830)] px-6 py-2.5 font-cinzel text-xs font-bold tracking-[1px] text-night uppercase",
        "disabled:bg-none disabled:bg-[rgb(201_168_76/0.3)] disabled:cursor-default",
        className
      )}
      {...props}
    />
  );
}
