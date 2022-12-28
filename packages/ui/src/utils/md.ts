import md from 'markdown-it'
import mk from 'markdown-it-katex'

const instance = md({
  html: true,
  linkify: true,
  typographer: true
})

instance.use(mk)

export function render(source: string): string {
  return instance.render(source)
}
