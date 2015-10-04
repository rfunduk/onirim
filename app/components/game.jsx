import classNames from 'classnames'

import isEmpty from 'lodash/lang/isEmpty'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd/modules/backends/HTML5'

import shouldPureComponentUpdate from '../utils/pure-render'

import { PLAYING, WON, LOST } from '../lib/constants'
import { UP_ARROW, DOWN_ARROW } from '../utils/icons'

import Deck from './deck'
import Discard from './discard'
import Hand from './hand'
import ReferenceHand from './reference-hand'
import Doors from './doors'
import Labyrinth from './labyrinth'
import Limbo from './limbo'
import Prophecy from './prophecy'

import QuitButton from './quit-button'

@DragDropContext( HTML5Backend )
export default class Game extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const { status } = this.props.game
    return (
      <div className='game-wrapper'>
        {status == PLAYING ? this.playing() : null}
        {status == WON ? this.won() : null}
        {status == LOST ? this.lost() : null}
      </div>
    )
  }

  playing() {
    const { game, hasUndo } = this.props
    const { undo, forfeit } = this.props.actions
    const { hand } = game
    const alt = isEmpty(game.limbo) ? 'labyrinth' : 'limbo'
    const main = isEmpty(game.prophecy) ? 'hand' : 'prophecy'

    return (
      <div className='game-container'>
        <div className='game-grid'>

          <div className='control game-area'>
            <h1>
              <span className='title'>ONIRIM</span>&nbsp;
              <QuitButton forfeit={forfeit} />
              &nbsp;
              { hasUndo ?
                  <button className='button small-button' onClick={undo}>UNDO</button> :
                  null }
            </h1>

            <div className='pile-container'>
              {this.deck()}
              {this.discard()}
            </div>

            {main == 'prophecy' ? this.referenceHand() : null}
            {main == 'hand' ? this.doors() : null}
          </div>

          <div className='play game-area'>
            {alt == 'labyrinth' ? this.labyrinth() : null}
            {alt == 'limbo' ? this.limbo() : null}

            <h3>
              {alt.toUpperCase()}
              &nbsp;{UP_ARROW}
              {DOWN_ARROW}
              &nbsp;{main.toUpperCase()}&nbsp;
              {
                main == 'hand' ?
                  <strong>{hand.length}/5</strong> :
                  null
              }
              {this.actions()}
              {this.info()}
            </h3>

            {main == 'prophecy' ? this.prophecy() : null}
            {main == 'hand' ? this.hand() : null}
          </div>

        </div>
      </div>
    )
  }

  deck() {
    const { deck } = this.props.game
    const { draw } = this.props.actions
    const { canDraw } = this.props.rules
    return (
      <Deck type='DECK'
            onClick={draw}
            canDraw={canDraw}
            count={deck.length} />
    )
  }

  discard() {
    const { discarded } = this.props.game
    const { canDiscard } = this.props.rules
    return (
      <Discard type='DISCARD'
               canDiscard={canDiscard}
               count={discarded.length} />
    )
  }

  hand( alt ) {
    const { hand } = this.props.game
    const { play, discard } = this.props.actions
    const { canPlay } = this.props.rules

    return (
      <Hand hand={hand}
            canPlay={canPlay}
            play={play}
            discard={discard} />
    )
  }

  referenceHand() {
    const { hand } = this.props.game
    return (
      <ReferenceHand hand={hand} />
    )
  }

  doors() {
    const { doors } = this.props.game
    const { play, discard } = this.props.actions
    const { canPlay } = this.props.rules
    return <Doors doors={doors}
                  canPlay={canPlay}
                  play={play}
                  discard={discard} />
  }

  labyrinth() {
    const { labyrinth } = this.props.game
    const { canPlay } = this.props.rules

    return (
      <Labyrinth labyrinth={labyrinth}
                 canPlay={canPlay} />
    )
  }

  limbo() {
    const { limbo, activeLimbo } = this.props.game
    const { canPlay, canShuffle, canDiscardAll,
            canDiscardTopFive } = this.props.rules
    const { discard, reshuffle, discardAll,
            discardTopFive } = this.props.actions

    return (
      <Limbo limbo={limbo}
             activeLimbo={activeLimbo}
             reshuffle={reshuffle}
             canShuffle={canShuffle}
             canPlay={canPlay} />
    )
  }

  prophecy() {
    const { prophecy } = this.props.game
    const { canResolveProphecy, isInProphecy } = this.props.rules
    const { discard, resolveProphecy, reorderProphecy } = this.props.actions

    return (
      <Prophecy prophecy={prophecy}
                discard={discard}
                isInProphecy={isInProphecy}
                canResolveProphecy={canResolveProphecy}
                reorderProphecy={reorderProphecy}
                resolveProphecy={resolveProphecy} />
    )
  }

  won() {
    const { newGame } = this.props.actions
    return (
      <div className='won'>
        <div>
          <h1>WON</h1>
          <button className='button won-lost-button' onClick={newGame}>GO AGAIN</button>
        </div>
      </div>
    )
  }
  lost() {
    const { newGame } = this.props.actions
    return (
      <div className='lost'>
        <div>
          <h1>LOST</h1>
          <button className='button won-lost-button' onClick={newGame}>GO AGAIN</button>
        </div>
      </div>
    )
  }

  actions() {
    const { discardAll, discardTopFive, reshuffle,
            resolveProphecy, draw } = this.props.actions
    const { canDiscardAll, canDiscardTopFive, canDraw,
            canShuffle, canResolveProphecy } = this.props.rules
    return (
      <div className='buttons'>
        { canDraw() &&
          <button className='button small-button'
                  onClick={draw}>DRAW CARD</button>}
        { canResolveProphecy() &&
          <button className='button small-button'
                  onClick={resolveProphecy}>RESOLVE PROPHECY</button>}
        { canDiscardAll() &&
          <button className='button small-button'
                  onClick={discardAll}>DISCARD HAND</button>}
        { canDiscardTopFive() &&
          <button className='button small-button'
                  onClick={discardTopFive}>DISCARD TOP 5</button>}
        { canShuffle() &&
          <button className='button small-button'
                  onClick={reshuffle}>SHUFFLE</button>}
      </div>
    )
  }

  info() {
    const { prophecy, lastProphecySize } = this.props.game
    if( prophecy.length > 0 && prophecy.length == lastProphecySize ) {
      return <small>DISCARD ONE</small>
    }
    else {
      return null
    }
  }
}
