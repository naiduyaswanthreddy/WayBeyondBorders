
import {
  toast as internalToast,
  type ToasterToast,
} from "@/components/ui/toast";

export type Toast = ToasterToast;

type ToastProps = Omit<ToasterToast, "id">;

export function toast(props: ToastProps) {
  return internalToast(props);
}

export function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => internalToast.dismiss(toastId),
  };
}
