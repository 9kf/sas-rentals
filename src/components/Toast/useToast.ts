import { create } from "zustand";

interface IToastState {
  isOpen: boolean;
  title?: string;
  message?: string;
  type: "success" | "error";
  showToast: (args: {
    type: "success" | "error";
    message: string;
    title: string;
  }) => void;
  closeToast: () => void;
}

const TOAST_HIDE_TIMER = 3500;

export const useToast = create<IToastState>()((set) => ({
  isOpen: false,
  title: undefined,
  message: undefined,
  type: "success",
  showToast({ message, title, type }) {
    set(() => ({ isOpen: true, message, title, type }));
    setTimeout(() => {
      set(() => ({ isOpen: false }));
    }, TOAST_HIDE_TIMER);
  },
  closeToast() {
    set(() => ({ isOpen: false }));
  },
}));
