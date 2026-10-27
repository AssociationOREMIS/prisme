// @vitest-environment jsdom
// Regression tests of the accessibility audit of 1.0.0-rc.7 (RGAA 4.1.2, WCAG 2.2 AA): names,
// focus kept or moved after an action, status messages. The browser behaviours (focus rings,
// forced colors, real focus loss) are covered by the stories' play functions.
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Users } from '@lucide/vue'
import { h } from 'vue'
import { PrButton } from './atoms/Button'
import { PrCheckbox } from './atoms/Checkbox'
import { PrInput } from './atoms/Input'
import { PrSpinner } from './atoms/Spinner'
import { PrTable } from './atoms/Table'
import { PrTagInput } from './atoms/TagInput'
import { PrAppShell } from './layouts/AppShell'
import { PrNavbar, PrNavbarUserMenu } from './layouts/Navbar'
import { PrCarousel } from './molecules/Carousel'
import { PrDataTable } from './molecules/DataTable'
import { PrDatePicker } from './molecules/DatePicker'
import { PrFileUpload } from './molecules/FileUpload'
import { PrPagination } from './molecules/Pagination'
import { PrRadioGroup } from './molecules/RadioGroup'
import { PrSidebar, PrSidebarItem } from './molecules/Sidebar'
import { PrSortableList } from './molecules/SortableList'
import { PrStepper } from './molecules/Stepper'

afterEach(() => {
  document.body.innerHTML = ''
  vi.useRealTimers()
})

/** Text of the component's polite status regions, once the announcer's delay has passed. */
async function statusText(root: Element): Promise<string> {
  await vi.advanceTimersByTimeAsync(700)
  return [...root.querySelectorAll('[role="status"]')].map(region => region.textContent?.trim()).filter(Boolean).join(' ')
}

describe('PrAppShell', () => {
  it('starts with a skip link to the main content, which can take the focus', () => {
    const wrapper = mount(PrAppShell, { slots: { default: () => 'Contenu' } })
    const link = wrapper.find('a.pr-skip-link')

    expect(wrapper.element.firstElementChild).toBe(link.element)
    expect(link.text()).toBe('Aller au contenu')
    expect(link.attributes('href')).toBe('#main-content')
    expect(wrapper.find('main').attributes()).toMatchObject({ id: 'main-content', tabindex: '-1' })
  })

  it('renders the footer slot as the page footer (contentinfo)', () => {
    const wrapper = mount(PrAppShell, { slots: { footer: () => h('a', { href: '/accessibilite' }, 'Accessibilité : partiellement conforme') } })

    expect(wrapper.find('footer').text()).toBe('Accessibilité : partiellement conforme')
  })

  it('leaves the skip link out on demand and takes another main id', () => {
    const wrapper = mount(PrAppShell, { props: { hideSkipLink: true, mainId: 'contenu' } })

    expect(wrapper.find('.pr-skip-link').exists()).toBe(false)
    expect(wrapper.find('main').attributes('id')).toBe('contenu')
  })
})

describe('PrNavbar', () => {
  it('makes the brand a link home, without repeating the brand in the logo alternative', () => {
    const wrapper = mount(PrNavbar, { props: { homeHref: '/' } })
    const link = wrapper.find('a.pr-navbar__home')

    expect(link.attributes('href')).toBe('/')
    expect(link.find('img').attributes('alt')).toBe('')
    expect(link.text()).toContain('OREMIS')
    expect(link.text()).toContain('(accueil)')
  })

  it('names the logo when the title says something else', () => {
    const wrapper = mount(PrNavbar, { props: { title: 'Formation', logoAlt: 'OREMIS' } })

    expect(wrapper.find('img').attributes('alt')).toBe('OREMIS')
    expect(wrapper.find('a').exists()).toBe(false)
  })
})

describe('PrNavbarUserMenu', () => {
  it('keeps the name in the trigger for screen readers on small screens', () => {
    const wrapper = mount(PrNavbarUserMenu, { props: { name: 'Camille MARTIN' } })
    const name = wrapper.find('.pr-navbar-user-menu__name')

    expect(name.text()).toBe('Camille MARTIN')
    // Visually hidden below md, never display:none (which removed the button's only name).
    expect(name.classes()).toContain('pr:max-md:sr-only')
    expect(name.classes()).not.toContain('pr:hidden')
  })
})

describe('PrButton loading', () => {
  it('stays focusable (aria-disabled, not disabled) and ignores clicks', async () => {
    const onClick = vi.fn()
    const wrapper = mount(PrButton, { props: { loading: true }, attrs: { onClick }, slots: { default: () => 'Confirmer' }, attachTo: document.body })
    const button = wrapper.find('button')

    expect(button.attributes('disabled')).toBeUndefined()
    expect(button.attributes('aria-disabled')).toBe('true')
    button.element.click()
    expect(onClick).not.toHaveBeenCalled()

    await wrapper.setProps({ loading: false })
    button.element.click()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('keeps a real disabled state for `disabled`', () => {
    const wrapper = mount(PrButton, { props: { disabled: true }, slots: { default: () => 'Envoyer' } })

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })
})

describe('PrSpinner', () => {
  it('holds its text inside the status region', () => {
    const wrapper = mount(PrSpinner)

    expect(wrapper.find('[role="status"]').text()).toBe('Chargement')
  })
})

describe('PrPagination', () => {
  it('keeps « Page suivante » focusable on the last page and names pages « Page n »', async () => {
    const wrapper = mount(PrPagination, { props: { pageCount: 3, page: 2 }, attachTo: document.body })
    const next = wrapper.find('.pr-pagination__next')
    ;(next.element as HTMLElement).focus()

    await wrapper.setProps({ page: 3 })

    expect(next.attributes('disabled')).toBeUndefined()
    expect(next.attributes('aria-disabled')).toBe('true')
    expect(document.activeElement).toBe(next.element)
    await next.trigger('click')
    expect(wrapper.emitted('update:page')).toBeUndefined()
    expect(wrapper.find('[aria-current="page"]').attributes('aria-label')).toBe('Page 3')
  })
})

describe('PrDataTable', () => {
  const columns = [{ key: 'name', label: 'Nom', sortable: true }, { key: 'city', label: 'Ville' }]
  const rows = Array.from({ length: 12 }, (_, index) => ({ id: index + 1, name: index ? `Bénévole ${index + 1}` : 'Camille MARTIN', city: 'Lyon' }))

  it('has a caption, column headers with scope and named row actions', () => {
    const wrapper = mount(PrDataTable, { props: { caption: 'Bénévoles inscrits', columns, rows, rowActions: [{ label: 'Voir' }], rowHeaderKey: 'name' } })

    expect(wrapper.find('caption').text()).toBe('Bénévoles inscrits')
    expect(wrapper.findAll('thead th').every(th => th.attributes('scope') === 'col')).toBe(true)
    expect(wrapper.find('tbody th[scope="row"]').text()).toBe('Camille MARTIN')
    expect(wrapper.find('tbody button').attributes('aria-label')).toBe('Actions pour Camille MARTIN')
  })

  it('warns without a caption or a name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(PrDataTable, { props: { columns, rows } })

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('PrDataTable'))
    warn.mockRestore()
  })

  it('is busy while loading and says how many rows a filter leaves', async () => {
    vi.useFakeTimers()
    const wrapper = mount(PrDataTable, { props: { ariaLabel: 'Bénévoles', columns, rows, filterKey: 'name' } })

    await wrapper.setProps({ loading: true })
    expect(wrapper.find('table').attributes('aria-busy')).toBe('true')
    expect(await statusText(wrapper.element)).toBe('Chargement')

    await wrapper.setProps({ loading: false })
    await wrapper.find('.pr-data-table__toolbar input').setValue('Camille')
    expect(await statusText(wrapper.element)).toBe('1 résultat. Page 1 sur 1')
  })

  it('keeps the focus on « Page suivante » once the last page is reached, and says the page', async () => {
    vi.useFakeTimers()
    const wrapper = mount(PrDataTable, { props: { ariaLabel: 'Bénévoles', columns, rows }, attachTo: document.body })
    const next = wrapper.findAll('.pr-data-table__pagination button').find(button => button.attributes('aria-label') === 'Page suivante')!
    ;(next.element as HTMLElement).focus()

    await next.trigger('click')

    expect(next.attributes('aria-disabled')).toBe('true')
    expect(next.attributes('disabled')).toBeUndefined()
    expect(document.activeElement).toBe(next.element)
    expect(await statusText(wrapper.element)).toBe('Page 2 sur 2')
  })
})

describe('chips and files removed with their button', () => {
  it('PrTagInput moves the focus to the next tag, then to the field, and announces it', async () => {
    vi.useFakeTimers()
    const wrapper = mount(PrTagInput, { props: { label: 'Compétences', defaultValue: ['Écoute', 'Animation'] }, attachTo: document.body })
    const buttons = () => wrapper.findAll('.pr-tag-input__remove')

    ;(buttons()[0].element as HTMLElement).focus()
    await buttons()[0].trigger('click')
    await flushPromises()
    expect(document.activeElement).toBe(buttons()[0].element)
    expect(await statusText(wrapper.element)).toBe('Écoute supprimé')

    await buttons()[0].trigger('click')
    await flushPromises()
    expect(document.activeElement).toBe(wrapper.find('input').element)
  })

  it('PrTagInput says when the limit is reached and stays focusable', async () => {
    const wrapper = mount(PrTagInput, { props: { label: 'Compétences', defaultValue: ['Écoute'], maxTags: 1 } })
    const input = wrapper.find('input')

    expect(input.attributes('disabled')).toBeUndefined()
    expect(input.attributes('readonly')).toBeDefined()
    expect(wrapper.find('.pr-tag-input__limit').text()).toBe('1 maximum atteint')
    expect(input.attributes('aria-describedby')).toContain(wrapper.find('.pr-tag-input__limit').attributes('id'))
  })

  it('PrFileUpload moves the focus to the drop zone after removing the last file', async () => {
    const file = new File(['x'], 'attestation.pdf', { type: 'application/pdf' })
    const wrapper = mount(PrFileUpload, { props: { label: 'Pièces justificatives', defaultValue: [file] }, attachTo: document.body })
    const remove = wrapper.find('.pr-file-upload__remove')
    ;(remove.element as HTMLElement).focus()

    await remove.trigger('click')
    await flushPromises()

    expect(document.activeElement).toBe(wrapper.find('.pr-file-upload__dropzone').element)
  })

  it('PrFileUpload shows and announces the refused files', async () => {
    vi.useFakeTimers()
    const wrapper = mount(PrFileUpload, { props: { label: 'Photo', accept: 'image/*' } })
    const input = wrapper.find('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [new File(['x'], 'notes.txt', { type: 'text/plain' })] })

    await input.trigger('change')

    expect(wrapper.find('.pr-file-upload__rejected').text()).toBe('notes.txt refusé : Type de fichier non accepté')
    expect(await statusText(wrapper.element)).toBe('notes.txt refusé : Type de fichier non accepté')
    expect(input.attributes('aria-hidden')).toBe('true')
  })
})

describe('field messages', () => {
  it('keeps the hint with the error, error first in aria-describedby', () => {
    const wrapper = mount(PrInput, { props: { label: 'Téléphone', hint: 'Format : 06 12 34 56 78', error: 'Numéro invalide' } })
    const [hint, error] = wrapper.findAll('.pr-field-message')

    expect(hint.text()).toBe('Format : 06 12 34 56 78')
    expect(error.text()).toBe('Numéro invalide')
    expect(wrapper.find('input').attributes('aria-describedby')).toBe(`${error.attributes('id')} ${hint.attributes('id')}`)
  })

  it('warns when a field has no name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(PrInput)
    mount(PrInput, { attrs: { 'aria-label': 'Rechercher' } })

    expect(warn).toHaveBeenCalledOnce()
    warn.mockRestore()
  })

  it('PrDatePicker gives autocomplete to the date field, not to its wrapper', () => {
    const wrapper = mount(PrDatePicker, { props: { label: 'Date de naissance' }, attrs: { autocomplete: 'bday', class: 'pr-test' } })

    expect(wrapper.find('input').attributes('autocomplete')).toBe('bday')
    expect(wrapper.classes()).toContain('pr-test')
    expect(wrapper.attributes('autocomplete')).toBeUndefined()
  })

  it('names a checkbox by its label and describes it by its description', () => {
    const wrapper = mount(PrCheckbox, { props: { label: 'Droit à l’image', description: 'Photos des ateliers' } })
    const control = wrapper.find('[role="checkbox"]')

    expect(document.getElementById(control.attributes('aria-labelledby')!)).toBeNull()
    expect(wrapper.find(`#${control.attributes('aria-labelledby')}`).text()).toBe('Droit à l’image')
    expect(wrapper.find(`#${control.attributes('aria-describedby')}`).text()).toBe('Photos des ateliers')
  })

  it('names a radio by its label and describes it by its description', () => {
    const wrapper = mount(PrRadioGroup, { props: { label: 'Rôle', options: [{ label: 'Bénévole', value: 'volunteer', description: 'Aide ponctuelle' }] } })
    const radio = wrapper.find('[role="radio"]')

    expect(wrapper.find(`[id="${radio.attributes('aria-labelledby')}"]`).text()).toBe('Bénévole')
    expect(wrapper.find(`[id="${radio.attributes('aria-describedby')}"]`).text()).toBe('Aide ponctuelle')
  })
})

describe('PrTable', () => {
  it('can keep its caption for screen readers only', () => {
    const wrapper = mount(PrTable, { props: { caption: 'Permanences', captionHidden: true } })

    expect(wrapper.find('caption').classes()).toContain('pr:sr-only')
  })
})

describe('texts in French', () => {
  it('PrStepper replaces reka’s English group name and status', () => {
    const wrapper = mount(PrStepper, { props: { steps: [{ label: 'Identité' }, { label: 'Disponibilités' }], defaultValue: 2 } })

    expect(wrapper.find('[role="group"]').attributes('aria-label')).toBe('Étapes')
    expect(wrapper.find('.pr-stepper__status').text()).toBe('Étape 2 sur 2')
    expect(wrapper.find('h4').exists()).toBe(false)
  })

  it('PrCarousel describes itself in French', () => {
    const wrapper = mount(PrCarousel, { props: { items: [{ title: 'Atelier' }] } })

    expect(wrapper.find('section').attributes('aria-roledescription')).toBe('carrousel')
    expect(wrapper.find('[role="group"]').attributes('aria-roledescription')).toBe('élément')
  })
})

describe('PrSidebar', () => {
  beforeEach(() => {
    window.matchMedia = ((query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} })) as unknown as typeof window.matchMedia
  })

  it('names its navigation and reads a badge after the label', () => {
    const wrapper = mount(PrSidebar, {
      props: { collapsed: false },
      slots: { default: () => h(PrSidebarItem, { label: 'Membres', href: '/membres', icon: Users, badgeCount: 3 }) },
    })

    expect(wrapper.find('nav').attributes('aria-label')).toBe('Navigation principale')
    expect(wrapper.find('aside').exists()).toBe(false)
    expect(wrapper.find('a').text()).toMatch(/Membres\s*, 3 notifications$/)
    expect(wrapper.find('.pr-sidebar-item__badge').attributes('aria-hidden')).toBe('true')
  })

  it('keeps the label in the link name in a narrow sidebar', () => {
    const wrapper = mount(PrSidebar, {
      props: { collapsed: true },
      slots: { default: () => h(PrSidebarItem, { label: 'Membres', href: '/membres', icon: Users }) },
    })

    expect(wrapper.find('a .pr\\:sr-only').text()).toBe('Membres')
  })
})

describe('PrSortableList move buttons', () => {
  it('moves an item with a single click and keeps the focus on the pressed button', async () => {
    vi.useFakeTimers()
    const items = [{ id: 1, label: 'Les formes' }, { id: 2, label: 'Les acteurs' }]
    const wrapper = mount(PrSortableList, {
      props: { defaultValue: items, ariaLabel: 'Leçons' },
      slots: { default: ({ item }: { item: unknown }) => (item as { label: string }).label },
      attachTo: document.body,
    })
    const down = wrapper.find('[aria-label="Descendre Les formes"]')

    expect(wrapper.find('[aria-label="Monter Les formes"]').attributes('aria-disabled')).toBe('true')
    await down.trigger('click')
    await flushPromises()

    expect(wrapper.findAll('li').map(li => li.text())).toEqual(['Les acteurs', 'Les formes'])
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Monter Les formes')
    expect(wrapper.emitted('change')).toHaveLength(1)
    expect(await statusText(wrapper.element)).toContain('Déplacement terminé : Les formes, position 2 sur 2.')
  })
})
