import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export const usePopup = (show: boolean): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [showPopup, setShowPopup] = useState(show)

  useEffect(() => {
    if (showPopup) {
      setTimeout(() => {
        setShowPopup(false)
      }, 5000)
    }
  }, [showPopup])

  return [showPopup, setShowPopup]
}
