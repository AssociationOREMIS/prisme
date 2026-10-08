/**
 * jsdom prints what it cannot do as errors: layout and scrolling, leaving its document, the modern
 * CSS of Prisme's styles. The tests check those through spies instead (see bladeNavigation.test.ts),
 * so only an exception thrown by a script of the page is still printed.
 */
type JsdomError = Error & { type: string, cause?: Error }
type VirtualConsole = { removeAllListeners: (event: string) => void, on: (event: string, listener: (error: JsdomError) => void) => void }

const dom = (globalThis as { jsdom?: { virtualConsole: VirtualConsole } }).jsdom

if (dom) {
  dom.virtualConsole.removeAllListeners('jsdomError')
  dom.virtualConsole.on('jsdomError', (error) => {
    if (error.type === 'unhandled-exception') console.error(error.cause?.stack ?? error.message)
  })
}
