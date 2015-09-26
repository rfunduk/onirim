import { draw, play, discard, discardAll, discardTopFive,
         reshuffle, reorderProphecy, resolveProphecy } from './updates'
import { newGame, devGame, forfeit } from './setup'

export default function game( state, action ) {
  switch( action.type ) {

    case 'SHUFFLE':
      return { ...state,
               ...reshuffle( state ) }

    case 'DRAW':
      return { ...state,
               ...draw( state ) }

    case 'PLAY':
      return { ...state,
               ...play( state, action.id ) }

    case 'DISCARD':
      return { ...state,
               ...discard( state, action.id ) }

    case 'DISCARD_ALL':
      return { ...state,
               ...discardAll( state ) }

    case 'DISCARD_TOP_FIVE':
      return { ...state,
               ...discardTopFive( state ) }

    case 'REORDER_PROPHECY':
      return { ...state,
               ...reorderProphecy( state, action.id, action.afterId ) }

    case 'RESOLVE_PROPHECY':
      return { ...state,
               ...resolveProphecy( state ) }

    case 'FORFEIT':
      return { ...state,
               ...forfeit( state ) }

    case 'NEW_GAME':
    default:
      return newGame( __DEV__ && devGame() )

  }
}
