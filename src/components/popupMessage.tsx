import { usePopup } from '@/hooks/usePopup'
import autoAnimate from '@formkit/auto-animate'
import { useEffect, useRef } from 'react'
import { AiOutlineCloseCircle } from 'react-icons/ai'

type TPopupMessageProps = {
  message: string
  show: boolean
}

export const PopupMessage = (props: TPopupMessageProps) => {
  const { message, show } = props
  const [showPopup, setShowPopup] = usePopup(show)
  const ref = useRef(null)

  useEffect(() => {
    ref.current && autoAnimate(ref.current)
  }, [])

  return (
    <div
      ref={ref}
      className='absolute bottom-0 w-screen'
    >
      {showPopup && (
        <div className='flex absolute bottom-4 left-0 right-0 ml-auto mr-auto pr-4 pl-4 pt-1 pb-1 w-fit h-fit bg-midnight-dark rounded items-center border-[1px] border-slate-700'>
          <span className='text-gray-300 whitespace-nowrap'>{message}</span>
          <div
            className='cursor-pointer ml-3'
            onClick={() => setShowPopup(false)}
          >
            <AiOutlineCloseCircle
              size={18}
              fill='#cf2f23'
            />
          </div>
        </div>
      )}
    </div>
  )
}
