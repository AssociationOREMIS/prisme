/**
 * One-off codemod (0.18): prefixes the Tailwind utilities of Prisme's components with `pr:`, so
 * they never collide with an app's own utilities of the same name (see CHANGELOG 0.18.0).
 *
 *   node scripts/prefix-classes.mjs [--write]
 *
 * A string is rewritten only when every word in it is a Tailwind utility (checked with Tailwind's
 * own design system), a BEM class of Prisme (`pr-*`), or a group/peer marker: labels, ids and CSS
 * values are left alone. A lone plain word in a script (`hidden` may be an input type, `block` a
 * variant) is only listed, to be checked by hand.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseJs } from '@babel/parser'
import { __unstable__loadDesignSystem } from '@tailwindcss/node'
import { parse as parseSfc } from '@vue/compiler-sfc'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const write = process.argv.includes('--write')
const PREFIX = 'pr:'

const designSystem = await __unstable__loadDesignSystem('@import "tailwindcss";', { base: root })
const cache = new Map()
function isUtility(token) {
  if (token.startsWith(PREFIX)) return false
  if (/^(group|peer)(\/[\w-]+)?$/.test(token)) return true
  if (!cache.has(token)) cache.set(token, designSystem.candidatesToCss([token])[0] != null)
  return cache.get(token)
}
const isPrismeClass = (token) => /^pr-[\w-]+$/.test(token) || /^sk-[\w-]+$/.test(token)

/** The string with its utilities prefixed, or null when it is not a class list. */
function prefixClassList(value) {
  const tokens = value.split(/\s+/).filter(Boolean)
  if (!tokens.length || tokens.some((token) => !isUtility(token) && !isPrismeClass(token) && !token.startsWith(PREFIX))) return null
  if (!tokens.some(isUtility)) return null
  return value.replace(/\S+/g, (token) => (isUtility(token) ? PREFIX + token : token))
}

/** Prefixes the utilities of a class attribute, keeping its other classes (`story-stack`). */
function prefixClassAttribute(value) {
  return value.replace(/\S+/g, (token) => (isUtility(token) ? PREFIX + token : token))
}

const singleWords = []

/** String literals and template literal chunks of a JS/TS source, as [start, end, text] (inside the quotes). */
function stringsOf(code, offset = 0, expression = false) {
  const ast = expression
    ? parseJs(`(${code})`, { plugins: ['typescript'], errorRecovery: true })
    : parseJs(code, { sourceType: 'module', plugins: ['typescript'], errorRecovery: true })
  const shift = expression ? -1 : 0
  const found = []
  const visit = (node) => {
    if (!node || typeof node.type !== 'string') return
    if (node.type === 'StringLiteral') found.push([node.start + 1 + shift + offset, node.end - 1 + shift + offset, node.value])
    if (node.type === 'TemplateElement') found.push([node.start + shift + offset, node.end + shift + offset, node.value.raw])
    if (node.type === 'ImportDeclaration' || node.type === 'ExportNamedDeclaration' && node.source) return
    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'leadingComments' || key === 'trailingComments') continue
      const child = node[key]
      if (Array.isArray(child)) child.forEach(visit)
      else if (child && typeof child === 'object') visit(child)
    }
  }
  visit(ast.program)
  return found
}

function rewriteScript(code, offset, file, edits, expression = false) {
  for (const [start, end, text] of stringsOf(code, offset, expression)) {
    // Story templates: HTML inside a template literal.
    if (/class="/.test(text)) {
      const html = text.replace(/(\bclass=")([^"]*)(")/g, (_, open, value, close) => open + prefixClassAttribute(value) + close)
      if (html !== text) edits.push([start, end, html])
      continue
    }
    const prefixed = prefixClassList(text)
    if (prefixed == null || prefixed === text) continue
    // A lone plain word (`block`, `grid`, `hidden`) is more often a value than a class.
    if (!expression && /^[a-z]+$/.test(text.trim())) {
      singleWords.push(`${path.relative(root, file)}: '${text}'`)
      continue
    }
    edits.push([start, end, prefixed])
  }
}

function rewriteTemplate(node, source, edits, file) {
  for (const prop of node.props ?? []) {
    if (prop.type === 6 && /class$/i.test(prop.name) && prop.value) {
      const value = prop.value.content
      const prefixed = prefixClassAttribute(value)
      if (prefixed !== value) edits.push([prop.value.loc.start.offset + 1, prop.value.loc.end.offset - 1, prefixed])
    }
    if (prop.type === 7 && prop.name === 'bind' && prop.arg?.content && /class$/i.test(prop.arg.content) && prop.exp) {
      rewriteScript(prop.exp.content, prop.exp.loc.start.offset, file, edits, true)
    }
  }
  for (const child of node.children ?? []) rewriteTemplate(child, source, edits, file)
}

function apply(source, edits) {
  let result = source
  for (const [start, end, text] of [...edits].sort((a, b) => b[0] - a[0])) result = result.slice(0, start) + text + result.slice(end)
  return result
}

function filesIn(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return filesIn(full)
    return /\.(vue|ts)$/.test(entry.name) && !/\.(test|d)\.ts$/.test(entry.name) ? [full] : []
  })
}

let changed = 0
for (const file of [...filesIn(path.join(root, 'src/components')), ...filesIn(path.join(root, 'src/stories'))]) {
  const source = fs.readFileSync(file, 'utf8')
  const edits = []
  if (file.endsWith('.vue')) {
    const { descriptor } = parseSfc(source, { filename: file })
    if (descriptor.template?.ast) rewriteTemplate(descriptor.template.ast, source, edits, file)
    for (const block of [descriptor.script, descriptor.scriptSetup].filter(Boolean)) rewriteScript(block.content, block.loc.start.offset, file, edits)
  } else {
    rewriteScript(source, 0, file, edits)
  }
  if (!edits.length) continue
  changed++
  if (write) fs.writeFileSync(file, apply(source, edits))
  else console.log(`${path.relative(root, file)}: ${edits.length} string(s)`)
}

console.log(`${changed} file(s) ${write ? 'rewritten' : 'to rewrite'}`)
if (singleWords.length) console.log(`\nSingle words left as they are, to check by hand:\n${singleWords.join('\n')}`)
