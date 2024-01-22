import { useEffect, useRef } from 'react'

export function useOutsideClick<T1 extends HTMLElement, T2 extends HTMLElement = any>(callback: () => void) {
  const ref = useRef<T1>(null)
  const triggerRef = useRef<T2>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current || !triggerRef.current) return
      if (e.target instanceof Node && !ref.current.contains(e.target) && !triggerRef.current.contains(e.target)) {
        callback()
      }
   }
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [ref, callback])

  return {
    ref,
    triggerRef
  }
}
