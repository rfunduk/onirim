import { findDOMNode } from 'react-dom'
import classNames from 'classnames'

import shouldPureComponentUpdate from '../utils/pure-render'
import cardOffsets from '../utils/card-offsets'
import calculateHoveredCard from '../utils/hovered-card'
import { OFFSETS, HAND_SIZE } from '../lib/constants'

import map from 'lodash/collection/map'

import Card from './card'

export default class ReferenceHand extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  state = { hoveredCard: null }

  render() {
    const { hand } = this.props
    const classes = classNames('reference-hand', 'play-area' )
    const offsets = cardOffsets( hand, 0, true )

    return (
      <div className={classes}
           onMouseMove={hand.length > 1 ? this.onMouseMove : null}
           onMouseOut={hand.length > 1 ? this.onMouseOut : null}>
        <h3>HAND <strong>{hand.length}/{HAND_SIZE}</strong></h3>
        <div className='card-container'>
          {
            map( hand, ( card, i ) => {
              return (
                <Card key={card}
                      offset={offsets[i]}
                      tiny={true}
                      hovered={card == this.state.hoveredCard}
                      stacked={true}
                      playable={false}
                      card={card} />
              )
            } )
          }
        </div>
      </div>
    )
  }

  onMouseOut = () => { this.setState( { hoveredCard: null } ) }

  onMouseMove = ( e ) => {
    const { hand } = this.props
    const hoveredCard = calculateHoveredCard( hand, findDOMNode(this), e, OFFSETS.TINY )
    this.setState( { hoveredCard } )
  }
}
