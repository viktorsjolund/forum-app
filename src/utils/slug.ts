export const getPostTitleSlug = (title: string) => {
  return encodeURIComponent(title.replaceAll(' ', '_')).toLowerCase()
}
