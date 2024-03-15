import { Parser, TBodyType, TDeclarationType } from '@/utils/parser'
import { cloneElement, useMemo } from 'react'

type TParserProps = {
  text: string
}

export const ParsedText = (props: TParserProps) => {
  const { text } = props
  const parsedTree = useMemo(() => {
    const parser = new Parser(text)
    const buffer: JSX.Element[] = []

    for (const bd of parser.ast) {
      switch (bd.type) {
        case TBodyType.LinebreakDeclaration:
          buffer.push(<br />)
          break
        case TBodyType.TextDeclaration:
          for (const td of bd.declarations) {
            if (td.type === TDeclarationType.LinebreakDeclarator) {
              buffer.push(<br />)
            } else {
              buffer.push(<span>{td.value}</span>)
            }
          }
          break
        case TBodyType.TagDeclaration:
          for (const dc of bd.declarations) {
            if (dc.type === TDeclarationType.LinebreakDeclarator) {
              buffer.push(<br />)
            } else {
              switch (bd.kind) {
                case 'a':
                  buffer.push(
                    <a href={dc.value} className='text-blue-600 underline'>
                      {dc.value}
                    </a>,
                  )
                  break
                case 'b':
                  buffer.push(<b>{dc.value}</b>)
                  break
                case 'i':
                  buffer.push(<i>{dc.value}</i>)
                  break
              }
            }
          }
          break
      }
    }

    return buffer
  }, [text])

  return <p>{parsedTree?.map((e, i) => cloneElement(e, { key: i }))}</p>
}
