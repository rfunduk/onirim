import last from 'lodash/array/last'
import isEmpty from 'lodash/lang/isEmpty'

import { HAND_SIZE, COLOR, SYMBOL } from './constants'
import findCardIn from '../utils/find-card-in'

export function canPlay( game, id ) {
  const { card, source } = findCardIn( id, { hand: game.hand, doors: game.doors } )
  if( !card ) { return false }

  if( !isEmpty(game.limbo) ) {
    if( game.activeLimbo == null ) { return false }

    const topLimbo = last( game.limbo )

    // you can only play keys or doors if you draw a nightmare card
    if( topLimbo[SYMBOL] == 'N' ) {
      return card[SYMBOL] == 'K' || card[SYMBOL] == 'D'
    }

    // you can only play a key of the same colour
    // if you draw a door
    if( topLimbo[SYMBOL] == 'D' && source == 'hand' ) {
      // you can only play a key of the same colour
      return card[SYMBOL] == 'K' && card[COLOR] == topLimbo[COLOR]
    }
  }
  else {
    // limbo is empty, so we can't play doors
    if( card[SYMBOL] == 'D' ) { return false }
  }

  // you can only play a non-dupe symbol
  const noDuplicateSymbols = game.labyrinth.length == 0 ||
                             last(game.labyrinth)[SYMBOL] != card[SYMBOL]

  // you can only play with a full hand unless
  // there is something in limbo
  const fullHand = game.limbo.length > 0 ||
                   game.hand.length == HAND_SIZE

  return noDuplicateSymbols && fullHand
}

export function canDraw( game ) {
  if( !isEmpty(game.limbo) && game.activeLimbo && game.activeLimbo[SYMBOL] == 'N' ) {
    return false
  }
  if( !isEmpty(game.prophecy) ) {
    return false
  }

  return !isEmpty(game.deck) && game.hand.length < HAND_SIZE
}

export function canDiscard( game, id ) {
  const { hand, prophecy, lastProphecySize,
          doors, limbo, activeLimbo } = game

  const { card, source, index } = findCardIn( id, { hand, prophecy, doors } )

  if( !card ) {
    // nothing? then you can't discard this of course
    return false
  }

  switch( source ) {
    case 'hand':
      if( hand.length != HAND_SIZE ) { return false }

      if( !isEmpty(limbo) ) {
        const topLimbo = last( limbo )
        const matchesDoor = card[COLOR] == topLimbo[COLOR] &&
                            topLimbo[SYMBOL] == 'D' &&
                            card[SYMBOL] == 'K'
        const matchesNightmare = card[SYMBOL] == 'K' &&
                                 topLimbo[SYMBOL] == 'N'
        return matchesDoor || matchesNightmare
      }
      return hand.length == HAND_SIZE

    case 'prophecy':
      // can only discard one card from prophecy
      return prophecy.length == lastProphecySize

    case 'doors':
      return !isEmpty(limbo) &&
             activeLimbo &&
             last(limbo)[SYMBOL] == 'N'

  }
}

export function canDiscardAll( game ) {
  if( isEmpty(game.limbo) || !game.activeLimbo ) { return false }
  if( game.activeLimbo[SYMBOL] == 'N' ) { return true }
  return false
}

export function canDiscardTopFive( game ) {
  if( isEmpty(game.limbo) || !game.activeLimbo || game.deck.length < 5 ) { return false }
  if( game.activeLimbo[SYMBOL] == 'N' ) { return true }
  return false
}

export function canShuffle( game ) {
  return !isEmpty(game.limbo) &&
         (!game.activeLimbo || game.activeLimbo[SYMBOL] != 'N') &&
         game.hand.length == HAND_SIZE
}

export function canResolveProphecy( game ) {
  return game.prophecy.length == game.lastProphecySize - 1
}

export function isInProphecy( game, id ) {
  const index = game.prophecy.indexOf( id )
  return index != -1
}
