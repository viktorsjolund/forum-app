import { ChangeEvent, useEffect, useState } from 'react'

type TStyledTextareaProps = {
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  label: string
  elementId: string
  required: boolean
  placeholder?: string
  maxLength?: number
  maxRows: number
}

export const StyledTextarea = (props: TStyledTextareaProps) => {
  const { elementId, label, onChange, value, required, placeholder, maxLength, maxRows } = props
  const [rows, setRows] = useState(1)

  useEffect(() => {
    setRows(value.split('\n').length)
  }, [value])

  const handleTextarea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const rowCount = e.target.value.split('\n').length
    if (rowCount >= maxRows) {
      return
    }
    onChange(e)
    setRows(rowCount)
  }

  return (
    <div className='w-full flex flex-col bg-midnight rounded-t-md'>
      <label
        htmlFor={elementId}
        className='text-gray-300 text-sm pt-1 pb-1 pl-3 pr-3'
      >
        {label}
      </label>
      <textarea
        value={value}
        onChange={handleTextarea}
        id={elementId}
        required={required}
        rows={1}
        style={{ height: `${rows * 1.5 + 1}rem` }}
        className='bg-midnight pr-3 pb-1 pl-3 pt-1 transition-colors focus:border-b-gray-50 hover:border-b-gray-50 focus:border-b-2 border-b-2 border-b-gray-900 overflow-hidden'
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </div>
  )
}
