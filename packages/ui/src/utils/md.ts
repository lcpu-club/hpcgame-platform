import md from 'markdown-it'
import mk from 'markdown-it-katex'
import { createStarryNight, common } from '@wooorm/starry-night'
import { toHtml } from 'hast-util-to-html'

const starryNight = await createStarryNight(common)

const instance = md({
  html: true,
  linkify: true,
  typographer: true,
  highlight(value: string, lang: string) {
    const scope = starryNight.flagToScope(lang)

    return toHtml({
      type: 'element',
      tagName: 'pre',
      properties: {
        className: scope
          ? [
              'highlight',
              'highlight-' + scope.replace(/^source\./, '').replace(/\./g, '-')
            ]
          : undefined
      },
      children: scope
        ? starryNight.highlight(value, scope).children
        : [{ type: 'text', value }]
    })
  }
})

instance.use(mk)

export function render(source: string): string {
  return instance.render(source)
}
