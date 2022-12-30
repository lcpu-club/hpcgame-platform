if (import.meta.env.VITE_CF_BEACON_TOKEN) {
  const elem = document.createElement('script')
  elem.src = `https://static.cloudflareinsights.com/beacon.min.js`
  elem.setAttribute(
    'data-cf-beacon',
    `{"token": "${import.meta.env.VITE_CF_BEACON_TOKEN}"}`
  )
  document.body.appendChild(elem)
}
