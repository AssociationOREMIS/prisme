import { TableHeader } from '@tiptap/extension-table'

// A row made only of header cells heads columns; a header cell in a row of data cells heads its row.
function scopeOfElement(element: HTMLElement): 'col' | 'row' {
  const cells = element.parentElement ? Array.from(element.parentElement.children) : [element]

  return cells.every(cell => cell.tagName === 'TH') ? 'col' : 'row'
}

/**
 * tiptap's table header cell with a `scope`, so screen readers tie each data cell to its headers
 * (RGAA 5.7). Parsed HTML keeps its `scope`, or gets one from its row: `col` in a row of header
 * cells only, `row` otherwise. A header cell created by a command defaults to `col`, which is right
 * for the editor's tables (`insertTable({ withHeaderRow: true })`, no header column offered); an app
 * calling `toggleHeaderColumn` itself sets `scope: 'row'` with `setCellAttribute`.
 */
export const ScopedTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      scope: {
        default: 'col',
        parseHTML: (element: HTMLElement) => element.getAttribute('scope') ?? scopeOfElement(element),
        renderHTML: (attributes: Record<string, unknown>) => (attributes.scope ? { scope: attributes.scope } : {}),
      },
    }
  },
})
