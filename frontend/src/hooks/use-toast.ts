"use client"

import * as React from "react"

type ToastVariant = "default" | "destructive"

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
}

interface ToastState {
  toasts: Toast[]
}

const toastState: ToastState = {
  toasts: [],
}

const listeners: Array<(state: ToastState) => void> = []

const memoryState = toastState

function dispatch(action: { type: string; toast?: Toast; toastId?: string }) {
  switch (action.type) {
    case "ADD_TOAST":
      if (action.toast) {
        memoryState.toasts = [action.toast, ...memoryState.toasts]
      }
      break
    case "UPDATE_TOAST":
      if (action.toast) {
        memoryState.toasts = memoryState.toasts.map((t) => (t.id === action.toast!.id ? { ...t, ...action.toast } : t))
      }
      break
    case "DISMISS_TOAST":
      if (action.toastId) {
        memoryState.toasts = memoryState.toasts.filter((t) => t.id !== action.toastId)
      }
      break
    case "REMOVE_TOAST":
      if (action.toastId) {
        memoryState.toasts = memoryState.toasts.filter((t) => t.id !== action.toastId)
      }
      break
  }

  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function toast({ ...props }: Omit<Toast, "id">) {
  const id = Math.random().toString(36).substr(2, 9)

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
    },
  })

  return {
    id,
    dismiss: () => dispatch({ type: "DISMISS_TOAST", toastId: id }),
    update: (props: Partial<Toast>) => dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } }),
  }
}

function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
