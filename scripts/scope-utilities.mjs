import postcss from 'postcss'
import selectorParser from 'postcss-selector-parser'

/**
 * Limits the Tailwind utilities of `styles-scoped.css` to Prisme elements: every selector of
 * the `prisme-scoped-utilities` layer gets `:where([class*=pr-], [class*="pr:"], ... *)` on its
 * subject (before any pseudo-element), then the layer is unwrapped so the utilities keep
 * their place in the cascade. `:where()` adds no specificity.
 */
const SCOPE = ':where([class*=pr-],[class*="pr:"],[class*=pr-] *,[class*="pr:"] *)'
const LAYER = 'prisme-scoped-utilities'

// Minifiers write ::before as the legacy :before, which is still a pseudo-element.
const LEGACY_PSEUDO_ELEMENTS = new Set([':before', ':after', ':first-line', ':first-letter'])

function isPseudoElement(value) {
  return value.startsWith('::') || LEGACY_PSEUDO_ELEMENTS.has(value)
}

const scopeSelector = selectorParser((selectors) => {
  selectors.each((selector) => {
    // The subject is the last compound: after the last combinator.
    let insertBefore = null
    for (let index = selector.nodes.length - 1; index >= 0; index--) {
      const node = selector.nodes[index]
      if (node.type === 'combinator') break
      if (node.type === 'pseudo' && isPseudoElement(node.value)) insertBefore = node
    }
    const scope = selectorParser.pseudo({ value: SCOPE })
    if (insertBefore) selector.insertBefore(insertBefore, scope)
    else selector.append(scope)
  })
})

function insideKeyframes(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && /keyframes$/.test(parent.name)) return true
  }
  return false
}

export function scopeUtilities(css) {
  const root = postcss.parse(css)
  let found = false
  root.walkAtRules('layer', (layer) => {
    if (layer.params !== LAYER) return
    found = true
    layer.walkRules((rule) => {
      if (!insideKeyframes(rule)) rule.selector = scopeSelector.processSync(rule.selector)
    })
    layer.replaceWith(layer.nodes)
  })
  if (!found) throw new Error(`No @layer ${LAYER} in the scoped stylesheet`)
  return root.toString()
}
