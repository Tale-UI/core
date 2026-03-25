/** Navigate the Storybook sidebar to a docs page by its story title. */
export function goToDocs(storyTitle: string) {
  const id = storyTitle
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]/g, '');
  window.parent.location.href = `?path=/docs/${id}--docs`;
}
