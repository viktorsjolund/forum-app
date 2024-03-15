export enum Token {
  StartTag,
  EndTag,
  EndStartTag,
  TagName,
  Text,
  NewLine,
}

export class Tokenizer {
  private tokens: [Token, string][] = []
  private cursor = 0

  constructor(text: string) {
    this.tokenize(text)
  }

  hasNextToken() {
    return this.cursor < this.tokens.length
  }

  getNextToken() {
    const token = this.tokens[this.cursor]
    this.cursor += 1
    return token
  }

  peek() {
    const token = this.tokens[this.cursor]
    return token ? token[0] : null
  }

  private tokenize(text: string) {
    const chars = text.split('')
    let sub = ''

    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === '<' && chars[i + 1] === '/') {
        if (sub.length > 0) {
          this.tokenizeSubstring(sub)
          sub = ''
        }
        const endStartTag = chars[i] + chars[i + 1]
        i += 2
        while (chars[i] !== '>' && i < chars.length) {
          sub += chars[i]
          i++
        }
        if (chars[i] === '>') {
          this.tokens.push([Token.EndStartTag, endStartTag])
          this.tokens.push([Token.TagName, sub])
          this.tokens.push([Token.EndTag, chars[i]])
          sub = ''
        } else {
          sub = endStartTag + sub
        }
      } else if (chars[i] === '<') {
        if (sub.length > 0) {
          this.tokenizeSubstring(sub)
          sub = ''
        }
        const startTag = chars[i]
        i++
        while (chars[i] !== '>' && i < chars.length) {
          console.log(chars[i])
          sub += chars[i]
          i++
        }
        if (chars[i] === '>') {
          this.tokens.push([Token.StartTag, startTag])
          this.tokens.push([Token.TagName, sub])
          this.tokens.push([Token.EndTag, chars[i]])
          sub = ''
        } else {
          sub = startTag + sub
        }
      } else {
        sub += chars[i]
      }
    }

    if (sub.length > 0) {
      this.tokenizeSubstring(sub)
    }
  }

  private tokenizeSubstring(s: string) {
    const chars = s.split('')
    let sub = ''

    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === '\\' && chars[i + 1] === 'n') {
        if (sub.length > 0) {
          this.tokens.push([Token.Text, sub])
          sub = ''
        }
        this.tokens.push([Token.NewLine, ''])
        i++
      } else {
        sub += chars[i]
      }
    }

    if (sub.length > 0) {
      this.tokens.push([Token.Text, sub])
    }
  }
}
