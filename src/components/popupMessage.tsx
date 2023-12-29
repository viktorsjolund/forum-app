import { useEffect, useState } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'

type TPopupMessageProps = {
  message: string
  showPopup: boolean
  handlePopupClose?: () => void
}

export const PopupMessage = (props: TPopupMessageProps) => {
  const { message, showPopup: propShowPopup, handlePopupClose } = props
  const [showPopup, setShowPopup] = useState(propShowPopup)

  useEffect(() => {
    setShowPopup(propShowPopup)
  }, [propShowPopup])

  const handleRemovePopup = () => {
    setShowPopup(false)
    handlePopupClose && handlePopupClose()
  }

  return (
    <>
      {showPopup && (
        <div className='flex absolute bottom-0 left-0 right-0 ml-auto mr-auto pr-4 pl-4 pt-1 pb-1 w-fit bg-main-purple-dark rounded-tr rounded-tl items-center border-t-2 border-l-2 border-r-2'>
          <span>{message}</span>
          <div
            className='cursor-pointer h-fit ml-2'
            onClick={handleRemovePopup}
          >
            <AiOutlineCloseCircle />
          </div>
        </div>
      )}
    </>
  )
}
