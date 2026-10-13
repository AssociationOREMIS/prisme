// A PIO identicon (what a volunteer without a photo gets), and a neutral
// illustration standing in for a photo: no real person's picture here.
export const IDENTICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MCA4MCIgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2Ij48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNlZWYxZjYiLz48ZyBmaWxsPSJoc2woMjM4LCA2MCUsIDMzJSkiPjxyZWN0IHg9IjUiIHk9IjUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjxyZWN0IHg9IjY1IiB5PSI1IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCB4PSIyNSIgeT0iNSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PHJlY3QgeD0iNDUiIHk9IjUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjxyZWN0IHg9IjE1IiB5PSIyNSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PHJlY3QgeD0iNTUiIHk9IjI1IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCB4PSI1IiB5PSIzNSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PHJlY3QgeD0iNjUiIHk9IjM1IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCB4PSIxNSIgeT0iMzUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjxyZWN0IHg9IjU1IiB5PSIzNSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PHJlY3QgeD0iMTUiIHk9IjQ1IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCB4PSI1NSIgeT0iNDUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjxyZWN0IHg9IjE1IiB5PSI2NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PHJlY3QgeD0iNTUiIHk9IjY1IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCB4PSIzNSIgeT0iNjUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjwvZz48L3N2Zz4='
export const PHOTO = 'data:image/svg+xml;base64,' + btoa(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">'
  + '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7cc3e8"/><stop offset="1" stop-color="#0d2c99"/></linearGradient></defs>'
  + '<rect width="96" height="96" fill="url(#g)"/><circle cx="48" cy="38" r="17" fill="#f3d2b3"/>'
  + '<path d="M16 96c4-22 18-32 32-32s28 10 32 32z" fill="#f3d2b3"/></svg>',
)
