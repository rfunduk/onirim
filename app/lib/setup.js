import flattenDeep from 'lodash/array/flattenDeep'
import shuffle from 'lodash/collection/shuffle'
import map from 'lodash/collection/map'
import times from 'lodash/utility/times'

import { HAND_SIZE, DISTRIBUTION, PLAYING, LOST } from './constants'
import { draw } from './updates'

export function newGame( initial ) {
  return {
    status: PLAYING,

    deck: [],
    hand: [],
    labyrinth: [],
    discarded: [],
    doors: [],

    limbo: [],
    activeLimbo: null,

    prophecy: [],
    lastProphecySize: null,

    ...( initial || setup( {
      limbo: [],
      hand: [],
      deck: generateDeck()
    } ) )
  }
}

export function forfeit( state ) {
  return { status: LOST }
}

export function setup( state ) {
  const { limbo, hand, deck } = state
  let r = { limbo, hand, deck }
  r.deck = shuffle( r.deck )
  while( r.hand.length < HAND_SIZE ) { r = draw( r ) }
  r.deck = shuffle( [ ...r.deck, ...r.limbo ] )
  r.limbo = []
  r.activeLimbo = null
  return r
}

function generateDeck() {
  // 10 nightmare cards
  const nightmares = times( DISTRIBUTION.N, i => `NN--${i}` )

  // suits: Yellow, Green, Blue, Red
  const cards = flattenDeep(
    map( [ 'Y', 'G', 'B', 'R' ], function( suit ) {
      // faces: Door, Key, Moon, Sun
      return map( [ 'D', 'K', 'M', 'S' ], function( face, i ) {
        const card = `${suit}${face}`
        const count = DISTRIBUTION[card] || DISTRIBUTION[face]
        return times( count, i => `${card}--${i}` )
      } )
    } )
  )

  return [...cards, ...nightmares]
}

export function devGame() {
  let deck = [
    // first five will be hand
    'RS--0',
    'RM--1',
    'RK--1',
    'BS--0',
    'YM--3',

    'GD--1',
    'RM--2',
    'NN--8',
    'GS--5',
    'BS--4',
    'BK--2',
    'GS--0',
    'YS--5',
    'RS--7',
    'YK--1',
    'RS--8',
    'BS--3',
    'GK--0',
    'YM--2',
    'RD--1',
    'GS--4',
    'NN--0',
    'GM--0',
    'YS--3',
    'GM--3',
    'YD--0',
    'BS--7',
    'NN--9',
    'BS--2',
    'NN--1',
    'YS--4',
    'BD--0',
    'GK--2',
    'GD--0',
    'RS--3',
    'NN--4',
    'YS--2',
    'RK--2',
    'RS--4',
    'BM--3',
    'NN--6',
    'RS--1',
    'GK--1',
    'YD--1',
    'RM--3',
    'RK--0',
    'YM--1',
    'BS--1',
    'NN--2',
    'YM--0',
    'GS--1',
    'RS--2',
    'GM--1',
    'YK--2',
    'BM--0',
    'YS--0',
    'GS--2',
    'BM--2',
    'NN--3',
    'BD--1',
    'RM--0',
    'RS--5',
    'YS--1',
    'BK--1',
    'RD--0',
    'NN--7',
    'BM--1',
    'GS--3',
    'GS--6',
    'BS--6',
    'RS--6',
    'NN--5',
    'GM--2',
    'YK--0',
    'BS--5',
    'BK--0'
  ]
  let hand = deck.splice( 0, 5 )
  return { hand: hand, deck: deck }
}
