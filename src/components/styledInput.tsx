import { ChangeEvent, MutableRefObject } from 'react'

type TStyledInputProps = {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  label: string
  elementId: string
  required: boolean
  pattern?: string
  placeholder?: string
  maxLength?: number
}

export const StyledInput = (props: TStyledInputProps) => {
  const { elementId, label, onChange, value, required, pattern, placeholder, maxLength } = props

  return (
    <div className='w-full flex flex-col bg-midnight rounded-t-md'>
      <label
        htmlFor={elementId}
        className='text-gray-300 text-sm pt-1 pb-1 pl-3 pr-3'
      >
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        id={elementId}
        required={required}
        className='bg-midnight pr-3 pb-1 pl-3 pt-1 focus:border-b-gray-50 transition-colors hover:border-b-gray-50 focus:border-b-2 border-b-2 border-b-gray-900 overflow-hidden'
        pattern={pattern}
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </div>
  )
}
