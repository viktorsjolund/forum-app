import { Tokenizer, Token } from './tokenizer'

export enum TBodyType {
  TextDeclaration,
  TagDeclaration,
  LinebreakDeclaration,
}

export enum TDeclarationType {
  TextDeclarator,
  LinebreakDeclarator,
}

type TDeclarator = {
  type: TDeclarationType
  value: string
}

type TBody = {
  type: TBodyType
  kind: string
  declarations: TDeclarator[]
}

export class Parser {
  private tokenizer: Tokenizer
  private _ast: TBody[] = []

  constructor(text: string) {
    this.tokenizer = new Tokenizer(text)
    this.parse()
  }

  get ast() {
    return this._ast
  }

  private parse() {
    while (this.tokenizer.hasNextToken()) {
      const token = this.tokenizer.getNextToken()

      switch (token[0]) {
        case Token.StartTag:
          if (this.tokenizer.peek() !== Token.TagName) {
            this._ast.push(
              this.textDeclaration([this.textDeclarator(token[1])]),
            )
            this.parse()
            return
          }

          const firstTagName = this.tokenizer.getNextToken()

          if (this.tokenizer.peek() !== Token.EndTag) {
            this._ast.push(
              this.textDeclaration([
                this.textDeclarator(token[1]),
                this.textDeclarator(firstTagName[1]),
              ]),
            )
            this.parse()
            return
          }

          const firstEndTag = this.tokenizer.getNextToken()

          if (
            this.tokenizer.peek() !== Token.Text &&
            this.tokenizer.peek() !== Token.NewLine
          ) {
            this._ast.push(
              this.textDeclaration([
                this.textDeclarator(token[1]),
                this.textDeclarator(firstTagName[1]),
                this.textDeclarator(firstEndTag[1]),
              ]),
            )
            this.parse()
            return
          }

          const textDeclarations: TDeclarator[] = []

          while (
            this.tokenizer.peek() === Token.Text ||
            this.tokenizer.peek() === Token.NewLine
          ) {
            const t = this.tokenizer.getNextToken()
            if (t[0] === Token.NewLine) {
              textDeclarations.push(this.linebreakDeclarator())
            } else {
              textDeclarations.push(this.textDeclarator(t[1]))
            }
          }

          if (this.tokenizer.peek() !== Token.EndStartTag) {
            this._ast.push(
              this.textDeclaration([
                this.textDeclarator(token[1]),
                this.textDeclarator(firstTagName[1]),
                this.textDeclarator(firstEndTag[1]),
                ...textDeclarations,
              ]),
            )
            this.parse()
            return
          }

          const endStartTag = this.tokenizer.getNextToken()

          if (this.tokenizer.peek() !== Token.TagName) {
            this._ast.push(
              this.textDeclaration([
                this.textDeclarator(token[1]),
                this.textDeclarator(firstTagName[1]),
                this.textDeclarator(firstEndTag[1]),
                ...textDeclarations,
                this.textDeclarator(endStartTag[1]),
              ]),
            )
            this.parse()
            return
          }

          const secondTagName = this.tokenizer.getNextToken()

          if (
            firstTagName[1] !== secondTagName[1] ||
            this.tokenizer.peek() !== Token.EndTag
          ) {
            this._ast.push(
              this.textDeclaration([
                this.textDeclarator(token[1]),
                this.textDeclarator(firstTagName[1]),
                this.textDeclarator(firstEndTag[1]),
                ...textDeclarations,
                this.textDeclarator(endStartTag[1]),
                this.textDeclarator(secondTagName[1]),
              ]),
            )
            this.parse()
            return
          }

          const secondEndTag = this.tokenizer.getNextToken()
          let kind: string | null

          switch (firstTagName[1]) {
            case 'a':
              kind = 'a'
              break
            case 'b':
              kind = 'b'
              break
            case 'i':
              kind = 'i'
              break
            default:
              kind = null
              break
          }

          if (kind) {
            this._ast.push(this.tagDeclaration(kind, textDeclarations))
          } else {
            this._ast.push(
              this.textDeclaration([
                this.textDeclarator(token[1]),
                this.textDeclarator(firstTagName[1]),
                this.textDeclarator(firstEndTag[1]),
                ...textDeclarations,
                this.textDeclarator(endStartTag[1]),
                this.textDeclarator(secondTagName[1]),
                this.textDeclarator(secondEndTag[1]),
              ]),
            )
          }
          break
        case Token.NewLine:
          this._ast.push(this.linebreakDeclaration())
          break
        default:
          this._ast.push(this.textDeclaration([this.textDeclarator(token[1])]))
          break
      }
    }
  }

  private textDeclarator(val: string): TDeclarator {
    return {
      type: TDeclarationType.TextDeclarator,
      value: val,
    }
  }

  private linebreakDeclarator(): TDeclarator {
    return {
      type: TDeclarationType.LinebreakDeclarator,
      value: '',
    }
  }

  private linebreakDeclaration(): TBody {
    return {
      type: TBodyType.LinebreakDeclaration,
      kind: '',
      declarations: [],
    }
  }

  private tagDeclaration(kind: string, declarations: TDeclarator[]): TBody {
    return {
      type: TBodyType.TagDeclaration,
      kind,
      declarations,
    }
  }

  private textDeclaration(declarations: TDeclarator[]): TBody {
    return {
      type: TBodyType.TextDeclaration,
      kind: 'text',
      declarations,
    }
  }
}
