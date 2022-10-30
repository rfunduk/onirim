export default function calculateHoveredCard(collection, element, event, cardOffset) {
  const lastCard = element.querySelector('.card:last-child')

  const offset = element.getBoundingClientRect().left
  const endX = lastCard.getBoundingClientRect().left +
    lastCard.offsetWidth - offset
  const x = event.clientX - offset

  if (x > endX + 6) {
    return null
  }
  else {
    const index = Math.min(Math.ceil(x / cardOffset), collection.length)
    const hovered = collection[index - 1]
    return hovered
  }
}
