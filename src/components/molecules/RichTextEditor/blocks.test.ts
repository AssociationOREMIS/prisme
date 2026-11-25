// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { filterSlashItems, groupSlashItems, htmlToSource, keepSlashMenuOpen, moveTarget, normalizeSearch } from './blocks'

const items = [
  { title: 'Texte', keywords: 'paragraphe' },
  { title: 'Titre', keywords: 'h2' },
  { title: 'Sous-titre', keywords: 'sous titre h3' },
  { title: 'Encadré info', keywords: 'encadre note' },
  { title: 'Encadré avertissement', keywords: 'encadre attention' },
]

describe('normalizeSearch', () => {
  it('ignores accents, case and outer spaces', () => {
    expect(normalizeSearch('  Élève ')).toBe('eleve')
  })
})

describe('filterSlashItems', () => {
  it('lists everything for an empty query', () => {
    expect(filterSlashItems(items, '')).toHaveLength(items.length)
  })

  it('puts the titles starting with the query first, then the other matches', () => {
    expect(filterSlashItems(items, 'tit').map(item => item.title)).toEqual(['Titre', 'Sous-titre'])
  })

  it('matches every word of the query, spaces included, accents ignored', () => {
    expect(filterSlashItems(items, 'encadre att').map(item => item.title)).toEqual(['Encadré avertissement'])
    expect(filterSlashItems(items, 'ENCADRÉ').map(item => item.title)).toEqual(['Encadré info', 'Encadré avertissement'])
  })

  it('searches the keywords too', () => {
    expect(filterSlashItems(items, 'paragraphe').map(item => item.title)).toEqual(['Texte'])
  })
})

describe('keepSlashMenuOpen', () => {
  it('stays open while the query is a search', () => {
    expect(keepSlashMenuOpen('', 5)).toBe(true)
    expect(keepSlashMenuOpen('xyz', 0)).toBe(true)
    expect(keepSlashMenuOpen('encadre att', 1)).toBe(true)
  })

  it('closes on ordinary writing: a space after the slash, two spaces, a long query, several words without a match', () => {
    expect(keepSlashMenuOpen(' titre', 3)).toBe(false)
    expect(keepSlashMenuOpen('titre  a', 1)).toBe(false)
    expect(keepSlashMenuOpen('a'.repeat(31), 1)).toBe(false)
    expect(keepSlashMenuOpen('ou bien', 0)).toBe(false)
  })
})

describe('groupSlashItems', () => {
  it('lists the items without a group first, then each group in order of appearance', () => {
    const groups = groupSlashItems([
      { title: 'Bannière', group: 'Mise en page' },
      { title: 'Texte' },
      { title: 'Bouton', group: 'Liens' },
      { title: 'Colonnes', group: 'Mise en page' },
    ])

    expect(groups.map(group => [group.name, group.items.map(item => item.title)])).toEqual([
      [undefined, ['Texte']],
      ['Mise en page', ['Bannière', 'Colonnes']],
      ['Liens', ['Bouton']],
    ])
  })
})

describe('moveTarget', () => {
  // Three blocks of sizes 4, 6 and 3: they start at 0, 4 and 10.
  const sizes = [4, 6, 3]

  it('moves a block above the previous one, or below the next one', () => {
    expect(moveTarget(sizes, 1, -1)).toBe(0)
    expect(moveTarget(sizes, 1, 1)).toBe(7)
    expect(moveTarget(sizes, 0, 1)).toBe(6)
  })

  it('stops at the edges of the document', () => {
    expect(moveTarget(sizes, 0, -1)).toBeNull()
    expect(moveTarget(sizes, 2, 1)).toBeNull()
    expect(moveTarget(sizes, 5, 1)).toBeNull()
  })
})

describe('htmlToSource', () => {
  it('writes one top-level block per line, keeping nested markup as it is', () => {
    expect(htmlToSource('<h2>Titre</h2><p>Un <strong>mot</strong></p><ul><li><p>Point</p></li></ul>'))
      .toBe('<h2>Titre</h2>\n<p>Un <strong>mot</strong></p>\n<ul><li><p>Point</p></li></ul>')
  })

  it('is empty for an empty document', () => {
    expect(htmlToSource('')).toBe('')
  })
})
