const warned = new Set<string>()

/**
 * Warns once per page that a component received a deprecated prop or event,
 * so an app still on the old name keeps working and learns what to rename.
 */
export function warnDeprecated(component: string, oldName: string, newName: string): void {
  const key = `${component}:${oldName}`
  if (warned.has(key)) return

  warned.add(key)
  console.warn(`[prisme] ${component}: \`${oldName}\` is deprecated, use \`${newName}\` instead. It will be removed in 1.0.`)
}
