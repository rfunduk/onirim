import slice from 'lodash/array/slice'
import last from 'lodash/array/last'
import take from 'lodash/array/take'
import find from 'lodash/collection/find'
import every from 'lodash/collection/every'
import reject from 'lodash/collection/reject'
import sortBy from 'lodash/collection/sortBy'
import shuffle from 'lodash/collection/shuffle'
import isEmpty from 'lodash/lang/isEmpty'

import { HAND_SIZE, COLOR, SYMBOL, LOST, WON } from './constants'
import findCardIn from '../utils/find-card-in'

export function draw( { limbo, activeLimbo, hand, deck } ) {
  if( hand.length < HAND_SIZE && !isEmpty(deck) ) {
    const card = deck[0]
    deck = slice( deck, 1 )

    // nightmares and doors go into limbo
    if( card[SYMBOL] == 'N' || card[SYMBOL] == 'D' ) {
      limbo = [ ...limbo, card ]
      activeLimbo = card
    }
    // regular cards go into your hand
    else {
      hand = [ ...hand, card ]
      activeLimbo = null
    }
  }

  if( isEmpty(deck) && hand.length != HAND_SIZE ) {
    return { status: LOST, hand, deck, limbo, activeLimbo }
  }

  return { limbo, activeLimbo, hand, deck }
}

export function play( state, id ) {
  let { hand, labyrinth, limbo, activeLimbo, deck, doors, discarded } = state

  const { card, source, index } = findCardIn( id, { hand, doors } )

  if( !card ) {
    throw new Error(`Card ${id} could not be found!`)
  }

  switch( source ) {
    case 'hand':
      hand = hand.slice()
      hand.splice( index, 1 )
      break
    case 'doors':
      doors = doors.slice()
      doors.splice( index, 1 )
      break
  }

  // we need to decide what to do with the card
  // if limbo is empty, we can play it into labyrinth
  if( isEmpty(limbo) ) {
    labyrinth = [ ...labyrinth, card ]

    // now we check if the top 3 cards are the same suit
    // and if so, find and grab a remaining door of
    // that colour from the deck
    const topThree = labyrinth.slice( -3 )
    if( topThree.length == 3 ) {
      const suit = last(topThree)[COLOR]
      const sameSuit = isExclusiveTopThree( labyrinth, suit )

      if( sameSuit ) {
        const finder = card => card[SYMBOL] == 'D' && card[COLOR] === suit
        const door = find( deck, finder )
        const index = deck.indexOf( door )

        if( door ) {
          deck = deck.slice()
          deck.splice( index, 1 )
          ;( { limbo, deck } = reshuffle( { deck, limbo } ) )
          doors = [ ...doors, door ]
        }
      }
    }
  }
  // if limbo isn't empty, we are wanting to play a key
  // against a nightmare, or against a door
  else if( activeLimbo != null ) {
    const topLimbo = last( limbo )

    ;( { limbo, discarded } =
      keyAgainstNightmareMaybe( card, topLimbo, {limbo, discarded} ) )

    ;( { limbo, discarded, doors } =
      keyAgainstDoorMaybe( card, topLimbo, {limbo, discarded, doors} ) )

    ;( { limbo, discarded } =
      doorAgainstNightmareMaybe( card, topLimbo, {limbo, discarded} ) )
  }
  // console.log( {hand, labyrinth, doors} )

  doors = sortBy( doors, d => d[COLOR] )

  if( doors.length == 8 ) { return { status: WON } }
  return { hand, labyrinth, deck, doors, discarded, limbo, activeLimbo: null }
}

export function discard( state, id ) {
  let { hand, limbo, deck, doors, discarded,
        prophecy, lastProphecySize, activeLimbo } = state

  const { card, source, index } = findCardIn( id, { hand, prophecy, doors } )

  if( !card ) {
    throw new Error(`Card ${id} could not be found!`)
  }

  switch( source ) {
    case 'hand':
      if( card[SYMBOL] == 'D' ) {
        return { status: LOST }
      }

      hand = hand.slice()
      hand.splice( index, 1 )

      if( isEmpty(limbo) ) {
        // we're just discarding a card cuz we feel like it
        discarded = [ ...discarded, card ]

        // is the card a key? then trigger a prophecy
        // unless you're just discarding a key from an
        // existing prophecy (...unlikely, but...)
        if( card[SYMBOL] == 'K' && isEmpty(prophecy) ) {
          prophecy = take( deck, 5 )
          lastProphecySize = prophecy.length
          deck = slice( deck, lastProphecySize )
        }
      }
      else {
        // get top card in limbo
        const topLimbo = last( limbo )

        ;( { limbo, discarded } =
          keyAgainstNightmareMaybe( card, topLimbo, {limbo, discarded} ) )

        ;( { limbo, discarded, doors } =
          keyAgainstDoorMaybe( card, topLimbo, {limbo, discarded, doors} ) )
      }

      doors = sortBy( doors, d => d[COLOR] )
      return { hand, limbo, deck, discarded, doors,
               prophecy, lastProphecySize, activeLimbo: null }

    case 'prophecy':
      // discarding from prophecy is easy, just do it
      // and you're done
      prophecy = prophecy.slice()
      prophecy.splice( index, 1 )
      discarded = [ ...discarded, card ]

      if( card[SYMBOL] == 'D' ) {
        return { status: LOST }
      }

      return { prophecy, discarded }

    case 'doors':
      // discarding from doors is playing against a nightmare
      doors = doors.slice()
      doors.splice( index, 1 )

      const topLimbo = last( limbo )

      ;( { limbo, discarded } =
        doorAgainstNightmareMaybe( card, topLimbo, {limbo, discarded} ) )

      doors = sortBy( doors, d => d[COLOR] )
      return { doors, limbo, discarded, activeLimbo: null }
  }
}

export function discardAll( state ) {
  let { discarded, deck, hand, limbo } = state

  // take nightmare off the top of limbo
  limbo = limbo.slice()
  const nightmare = limbo.pop()

  // discard the whole hand and the nightmare
  discarded = [ ...discarded, ...hand, nightmare ]
  hand = []

  // shuffle limbo back into deck
  let r = { hand, ...reshuffle( { deck, limbo } ) }
  // draw up to 5
  while( r.hand.length < HAND_SIZE && !isEmpty(r.deck) ) {
    r = draw( r )
  }
  return { discarded, ...r, ...reshuffle( r ) }
}

export function discardTopFive( state ) {
  let { discarded, deck, limbo } = state

  // take nightmare off the top of limbo
  limbo = limbo.slice()
  const nightmare = limbo.pop()

  // take top 5 from deck
  deck = deck.slice()
  let top5 = []
  let toLimbo = []

  while( top5.length < 5 && deck.length > 0 ) {
    let card = deck.pop()
    if( card[SYMBOL] == 'N' || card[SYMBOL] == 'D' ) {
      // send to limbo
      toLimbo.push( card )
    }
    else {
      top5.push( card )
    }
  }

  // make sure we have 5 non-doors, non-nightmares
  if( top5.length != 5 ) { return { status: LOST } }

  // discard the whole hand and the nightmare
  discarded = [ ...discarded, ...top5, nightmare ]
  limbo = [ ...limbo, ...toLimbo ]

  // shuffle limbo back into deck
  return { discarded, ...reshuffle( { deck, limbo } ) }
}

export function reshuffle( state ) {
  let { deck, limbo } = state
  deck = shuffle( [...deck, ...limbo] )
  limbo = []
  return { deck, limbo, activeLimbo: null }
}

export function reorderProphecy( state, id, afterId ) {
  let prophecy = [ ...state.prophecy ]

  const card = find( prophecy, c => c === id )
  const afterCard = find( prophecy, c => c === afterId )
  const cardIndex = prophecy.indexOf( card )
  const afterIndex = prophecy.indexOf( afterCard )

  prophecy.splice( cardIndex, 1 )
  prophecy.splice( afterIndex, 0, card )

  return { prophecy }
}
export function resolveProphecy( state ) {
  let { prophecy, deck } = state

  prophecy = [ ...prophecy ].reverse()
  deck = [ ...prophecy, ...deck ]
  prophecy = []

  return { prophecy, deck, lastProphecySize: null }
}


///
/// UTILS/COMMON
///

function keyAgainstNightmareMaybe( card, nightmare, game ) {
  if( nightmare[SYMBOL] == 'N', card[SYMBOL] == 'K' ) {
    game.limbo = game.limbo.slice()
    game.limbo.pop()
    game.discarded = [ ...game.discarded, nightmare, card ]
  }
  return game
}

function keyAgainstDoorMaybe( card, door, game ) {
  if( door[SYMBOL] == 'D' && card[SYMBOL] == 'K' && card[COLOR] == door[COLOR] ) {
    game.limbo = game.limbo.slice()
    game.limbo.pop()
    game.discarded = [ ...game.discarded, card ]
    game.doors = [ ...game.doors, door ]
  }

  return game
}

function doorAgainstNightmareMaybe( card, nightmare, game ) {
  if( nightmare[SYMBOL] == 'N' && card[SYMBOL] == 'D' ) {
    game.limbo = game.limbo.slice()
    game.limbo.pop()
    game.discarded = [ ...game.discarded, card, nightmare ]
  }
  return game
}

function isExclusiveTopThree( cards, suit ) {
  // go through the cards, consuming 3 at a time and
  // resetting a runner as you go. this way
  // we can prevent the 4th in a set counting as the 3rd
  let currentSet = []
  let lastCard = null

  for( var i = 0; i < cards.length; i++ ) {
    const card = cards[i]
    if( currentSet.length == 3 ||
        (lastCard && lastCard[COLOR] != card[COLOR]) ) {
      currentSet = []
      lastCard = null
    }
    const matches = !lastCard || card[COLOR] == lastCard[COLOR]
    if( matches ) { currentSet.push( card ) }
    lastCard = card
  }

  return currentSet.length == 3 &&
         every( currentSet, card => card[COLOR] == suit )
}
