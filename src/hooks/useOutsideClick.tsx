import { useEffect, useRef } from 'react'

export function useOutsideClick<
  T1 extends HTMLElement,
  T2 extends HTMLElement = any,
  T3 extends HTMLElement = any
>(callback: () => void) {
  const ref = useRef<T1>(null)
  const triggerRef = useRef<T2>(null)
  const refArray = useRef<Array<T3 | null>>([])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.target instanceof Node) {
        if (
          !refArray.current.includes(e.target as T3) &&
          !ref.current?.contains(e.target) &&
          !triggerRef.current?.contains(e.target)
        ) {
          callback()
        }
      }
    }
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [ref, callback])

  return {
    ref,
    triggerRef,
    refArray
  }
}
