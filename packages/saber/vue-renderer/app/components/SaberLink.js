import isAbsoluteUrl from '../utils/is-absolute-url'

const setAttribute = (attrs, name, value) => {
  if (attrs[name] === undefined) {
    attrs[name] = value
  }
}

const HTTP_RE = /^https?:\/\//

export default {
  name: 'SaberLink',

  functional: true,

  render(h, { data, children, parent }) {
    const attrs = { ...data.attrs }
    const isExternal = typeof attrs.to === 'string' && isAbsoluteUrl(attrs.to)

    if (isExternal) {
      if (HTTP_RE.test(attrs.to)) {
        setAttribute(attrs, 'rel', 'noopener noreferrer')

        if (attrs.openLinkInNewTab !== false) {
          setAttribute(attrs, 'target', '_blank')
        }
      }
      attrs.href = attrs.to
      delete attrs.to
    } else {
      if (typeof attrs.to === 'string') {
        attrs.to = parent.$saber.getPageLink(attrs.to)
      } else {
        const { route } = parent.$router.resolve(attrs.to)
        attrs.to = parent.$saber.getPageLink(route.fullPath)
      }
    }

    delete attrs.openLinkInNewTab

    return h(
      isExternal ? 'a' : 'router-link',
      {
        ...data,
        attrs
      },
      children
    )
  }
}
