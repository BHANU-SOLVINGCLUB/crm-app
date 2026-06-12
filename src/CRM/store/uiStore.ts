import { create } from 'zustand'

export type ToastTone = 'info' | 'success'

interface ToastState {
  id: number
  message: string
  tone: ToastTone
}

interface UiState {
  toast: ToastState | null
  pushToast: (message: string, tone?: ToastTone) => void
  clearToast: () => void
}

let toastId = 0

export const useUiStore = create<UiState>((set) => ({
  toast: null,
  pushToast: (message, tone = 'info') => {
    toastId += 1
    set({ toast: { id: toastId, message, tone } })
  },
  clearToast: () => set({ toast: null }),
}))

export function pushAppToast(message: string, tone: ToastTone = 'info') {
  useUiStore.getState().pushToast(message, tone)
}
