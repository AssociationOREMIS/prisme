import { describe, expect, it } from 'vitest'
import { useErrorText } from './fieldError'

describe('useErrorText', () => {
  it('shows a plain message as is', () => {
    expect(useErrorText(() => 'Le nom est obligatoire.').value).toBe('Le nom est obligatoire.')
  })

  it("shows the first of Laravel's messages", () => {
    expect(useErrorText(() => ['Le nom est obligatoire.', 'Le nom est trop court.']).value).toBe('Le nom est obligatoire.')
  })

  it('treats no message, an empty string and an empty array as no error', () => {
    expect(useErrorText(() => undefined).value).toBeUndefined()
    expect(useErrorText(() => '').value).toBeUndefined()
    expect(useErrorText(() => []).value).toBeUndefined()
  })
})
