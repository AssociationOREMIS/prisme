import { describe, expect, it } from 'vitest'
import { fromLaravelErrors, required, usePrForm } from './usePrForm'

describe('usePrForm — isDirty / reset with non-primitive fields', () => {
  it('is not dirty right after creation for an array field', () => {
    const form = usePrForm({
      tags: { initialValue: ['a', 'b'] },
    })

    expect(form.isDirty.value).toBe(false)
  })

  it('is not dirty right after creation for an object field', () => {
    const form = usePrForm({
      address: { initialValue: { city: 'Lyon' } },
    })

    expect(form.isDirty.value).toBe(false)
  })

  it('becomes dirty only after an actual mutation, and clean again once reverted', () => {
    const form = usePrForm({
      tags: { initialValue: ['a', 'b'] },
    })

    form.fields.tags.value = [...form.fields.tags.value, 'c']
    expect(form.isDirty.value).toBe(true)

    form.fields.tags.value = ['a', 'b']
    expect(form.isDirty.value).toBe(false)
  })

  it('reset() restores the field without corrupting the schema initial value', () => {
    const form = usePrForm({
      items: { initialValue: [{ name: 'first' }] },
    })

    form.fields.items.value.push({ name: 'second' })
    expect(form.fields.items.value).toHaveLength(2)

    form.reset()

    expect(form.fields.items.value).toEqual([{ name: 'first' }])
    expect(form.isDirty.value).toBe(false)

    // A second round-trip must still start from the original, uncorrupted value.
    form.fields.items.value.push({ name: 'second-again' })
    form.reset()
    expect(form.fields.items.value).toEqual([{ name: 'first' }])
  })
})

describe('fromLaravelErrors', () => {
  it('matches an exact field key', () => {
    const form = usePrForm({ email: { initialValue: '' } })

    const unmatched = fromLaravelErrors(form, { email: ['Adresse invalide'] })

    expect(form.errors.email.value).toBe('Adresse invalide')
    expect(unmatched).toEqual([])
  })

  it('falls back array-item keys to their base field', () => {
    const form = usePrForm({ 'items.name': { initialValue: '' } })

    const unmatched = fromLaravelErrors(form, { 'items.0.name': ['Le nom est requis'] })

    expect(form.errors['items.name'].value).toBe('Le nom est requis')
    expect(unmatched).toEqual([])
  })

  it('returns messages that match no field instead of dropping them', () => {
    const form = usePrForm({ email: { initialValue: '' } })

    const unmatched = fromLaravelErrors(form, { 'items.0.name': ['Le nom est requis'] })

    expect(form.errors.email.value).toBeNull()
    expect(unmatched).toEqual(['Le nom est requis'])
  })
})

describe('usePrForm — handleSubmit', () => {
  it('populates generalErrors from unmatched Laravel 422 errors and returns false', async () => {
    const form = usePrForm({ email: { initialValue: 'test@example.com' } })

    const ok = await form.handleSubmit(() => {
      const error = new Error('Validation failed') as Error & { response: unknown }
      error.response = { status: 422, data: { errors: { 'items.0.name': ['Le nom est requis'] } } }
      throw error
    })

    expect(ok).toBe(false)
    expect(form.generalErrors.value).toEqual(['Le nom est requis'])
  })

  it('rethrows non-422 errors', async () => {
    const form = usePrForm({ email: { initialValue: '' } })

    await expect(form.handleSubmit(() => {
      throw new Error('boom')
    })).rejects.toThrow('boom')
  })

  it('does not call the submit function when validation fails', async () => {
    const form = usePrForm({ email: { initialValue: '', rules: [required()] } })
    let called = false

    const ok = await form.handleSubmit(() => { called = true })

    expect(ok).toBe(false)
    expect(called).toBe(false)
    expect(form.errors.email.value).toBe('Ce champ est requis')
  })

  it('tracks isSubmitting while the callback runs, resetting it whether it succeeds, fails validation, or throws', async () => {
    const form = usePrForm({ email: { initialValue: 'test@example.com' } })
    expect(form.isSubmitting.value).toBe(false)

    let duringSubmit = false
    await form.handleSubmit(async () => {
      duringSubmit = form.isSubmitting.value
      await Promise.resolve()
    })
    expect(duringSubmit).toBe(true)
    expect(form.isSubmitting.value).toBe(false)

    const invalidForm = usePrForm({ email: { initialValue: '', rules: [required()] } })
    await invalidForm.handleSubmit(() => {})
    expect(invalidForm.isSubmitting.value).toBe(false)

    await expect(form.handleSubmit(() => {
      throw new Error('boom')
    })).rejects.toThrow('boom')
    expect(form.isSubmitting.value).toBe(false)
  })
})
