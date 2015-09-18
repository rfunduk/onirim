import map from 'lodash/collection/map'

import { OFFSETS } from '../lib/constants'
const { TINY, REGULAR, COMPRESSED } = OFFSETS

function offset( tiny, compress, card, index ) {
  const BASE_AMOUNT = tiny ? TINY : REGULAR
  let amount

  if( index <= compress ) {
    amount = index * COMPRESSED
  }
  else {
    amount = (COMPRESSED * compress) +
             ((index - compress) * BASE_AMOUNT)
  }

  return amount
}

export default function offsets( cards, compressCount=10, tiny=false ) {
  compressCount = compressCount || Infinity
  const total = cards.length
  const compressedCount = Math.max( 0, total - compressCount )
  const offsetFn = offset.bind( this, tiny, compressedCount )
  return map( cards, offsetFn )
}
