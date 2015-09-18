import each from 'lodash/collection/each'

export default function findCardIn( id, sets ) {
  let card = null
  let source = null
  let index = null

  each( sets, function( cards, name ) {
    let i = cards.indexOf( id )
    if( i != -1 ) {
      card = cards[i]
      source = name
      index = i
    }
  } )

  return { card, source, index }
}
