import { ButtonHTMLAttributes, ReactNode } from 'react'

type TStyledButtonProps = {
  children: ReactNode
  type: ButtonHTMLAttributes<HTMLButtonElement>['type']
}

export const StyledButton = (props: TStyledButtonProps) => {
  const { children, type } = props

  return (
    <button
      type={type}
      className='flex leading-6 transition-colors justify-center items-center pr-4 pl-4 pb-1 pt-1 w-full h-full rounded bg-main-purple hover:bg-main-purple-dark shadow-lg font-medium text-sm'
    >
      {children}
    </button>
  )
}
