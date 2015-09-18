import { bindActionCreators } from 'redux'

const action = ( type, ...props ) => ( ...args ) =>
  props.reduce( ( action, prop, i ) =>
    (action[prop] = args[i], action), { type }
  )

const GameActions = {
  undo: action( 'UNDO' ),
  reshuffle: action( 'SHUFFLE' ),
  draw: action( 'DRAW' ),
  newGame: action( 'NEW_GAME' ),
  forfeit: action( 'FORFEIT' ),
  play: action( 'PLAY', 'id' ),
  discard: action( 'DISCARD', 'id' ),
  discardAll: action( 'DISCARD_ALL' ),
  discardTopFive: action( 'DISCARD_TOP_FIVE' ),
  reorderProphecy: action( 'REORDER_PROPHECY', 'id', 'afterId' ),
  resolveProphecy: action( 'RESOLVE_PROPHECY' )
}

export default function bindActions( dispatch ) {
  return bindActionCreators( GameActions, dispatch )
}
