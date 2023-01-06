import { createStarryNight, common } from '@wooorm/starry-night'
import { visit } from 'unist-util-visit'
import { toString } from 'hast-util-to-string'
import { unified, type Transformer } from 'unified'
import type { Root } from 'hast'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'

const starryNight = await createStarryNight(common)

export function rehypeStarryNight(): Transformer<Root, Root> {
  const prefix = 'language-'
  return function (tree) {
    visit(tree, 'element', function (node, index, parent) {
      if (!parent || index === null || node.tagName !== 'pre') {
        return
      }
      const head = node.children[0]
      if (
        !head ||
        head.type !== 'element' ||
        head.tagName !== 'code' ||
        !head.properties
      ) {
        return
      }
      const classes = head.properties.className
      if (!Array.isArray(classes)) return
      const language = classes.find(
        (d) => typeof d === 'string' && d.startsWith(prefix)
      )
      if (typeof language !== 'string') return
      const scope = starryNight.flagToScope(language.slice(prefix.length))
      if (!scope) return
      const fragment = starryNight.highlight(toString(head), scope)
      const children = /** @type {Array<ElementContent>} */ fragment.children
      parent.children.splice(index, 1, {
        type: 'element',
        tagName: 'div',
        properties: {
          className: [
            'highlight',
            'highlight-' + scope.replace(/^source\./, '').replace(/\./g, '-')
          ]
        },
        children: [
          { type: 'element', tagName: 'pre', properties: {}, children }
        ]
      })
    })
  }
}

export function render(source: string): string {
  const file = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStarryNight)
    .use(rehypeKatex)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .processSync(source)

  return String(file)
}
