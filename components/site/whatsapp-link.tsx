import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generalWhatsappMessage, whatsappLink } from "@/lib/whatsapp";

interface WhatsAppLinkProps {
  /** Prefilled message. Defaults to a generic enquiry line. */
  message?: string;
  /** wa.me number (digits). Defaults to the configured business number. */
  number?: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  showIcon?: boolean;
}

/** A plain anchor to WhatsApp — safe to render in server or client trees. */
export function WhatsAppLink({
  message,
  number,
  className,
  variant = "primary",
  size = "md",
  children = "Chat on WhatsApp",
  showIcon = true,
}: WhatsAppLinkProps) {
  return (
    <a
      href={whatsappLink(message ?? generalWhatsappMessage(), number)}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {showIcon && <MessageCircle aria-hidden="true" />}
      {children}
    </a>
  );
}
