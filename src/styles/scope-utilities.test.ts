import { describe, expect, it } from 'vitest'
// @ts-expect-error plain .mjs build script, no type declarations
import { scopeUtilities } from '../../scripts/scope-utilities.mjs'

const SCOPE = ':where([class*=pr-],[class*="pr:"],[class*=pr-] *,[class*="pr:"] *)'
const wrap = (css: string) => `:root{--a:1}@layer prisme-scoped-utilities{${css}}`

describe('scopeUtilities (styles-scoped.css)', () => {
  it('limits a utility to Prisme elements and unwraps the layer', () => {
    expect(scopeUtilities(wrap('.collapse{visibility:collapse}'))).toBe(`:root{--a:1}.collapse${SCOPE}{visibility:collapse}`)
  })

  it('scopes the subject of each selector, after pseudo-classes and before pseudo-elements', () => {
    const css = scopeUtilities(wrap('.a:hover,.b .c{x:1}.d:before{x:2}.e::placeholder{x:3}'))
    expect(css).toContain(`.a:hover${SCOPE},.b .c${SCOPE}{x:1}`)
    expect(css).toContain(`.d${SCOPE}:before{x:2}`)
    expect(css).toContain(`.e${SCOPE}::placeholder{x:3}`)
  })

  it('leaves nested at-rules working and keyframes untouched', () => {
    const css = scopeUtilities(wrap('@media (width>=40rem){.sm\\:flex{display:flex}}@keyframes k{from{opacity:0}}'))
    expect(css).toContain(`@media (width>=40rem){.sm\\:flex${SCOPE}{display:flex}}`)
    expect(css).toContain('@keyframes k{from{opacity:0}}')
  })

  it('fails loudly when the layer is missing', () => {
    expect(() => scopeUtilities('.a{x:1}')).toThrow(/prisme-scoped-utilities/)
  })
})
