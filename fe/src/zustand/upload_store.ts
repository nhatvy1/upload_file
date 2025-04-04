import { create } from 'zustand'

type ProgressState = {
  progress: number
  status: 'idle' | 'running' | 'success' | 'error'
  message: string
  start: () => void
  update: (progress: number) => void
  success: (message: string) => void
  error: (message: string) => void
  reset: () => void
  worker: Worker | null
  setWorker: (worker: Worker | null) => void
  cancel: () => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  progress: 0,
  status: 'idle',
  message: '',
  start: () =>
    set({ status: 'running', progress: 0, message: 'Processing...' }),
  update: (progress) => set({ progress }),
  success: (message) => set({ status: 'success', progress: 100, message }),
  error: (message) => set({ status: 'error', message }),
  reset: () => set({ status: 'idle', progress: 0, message: '' }),
  worker: null,
  setWorker: (worker) => set({ worker }),
  cancel: () => {
    set((state) => {
      state.worker?.terminate() // Dừng worker
      return {
        status: 'idle',
        progress: 0,
        message: 'Upload cancelled',
        worker: null
      }
    })
    // Tự động reset sau 3 giây
    setTimeout(() => useProgressStore.getState().reset(), 3000)
  }
}))
