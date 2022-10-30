import { findDOMNode } from 'react-dom'
import classNames from 'classnames'

import shouldPureComponentUpdate from '../utils/pure-render'
import cardOffsets from '../utils/card-offsets'
import calculateHoveredCard from '../utils/hovered-card'
import { OFFSETS, DOORS_TARGET } from '../lib/constants'

import map from 'lodash/collection/map'

import Card from './card'

export default class Doors extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  state = { hoveredCard: null }

  render() {
    const { doors } = this.props
    const { canPlay } = this.props
    const { play, discard } = this.props
    const classes = classNames('doors', 'play-area')
    const offsets = cardOffsets(doors, 0, true)

    return (
      <div className={classes}
        onMouseMove={doors.length > 1 ? this.onMouseMove : null}
        onMouseOut={doors.length > 1 ? this.onMouseOut : null}>
        <h3>DOORS <strong>{doors.length}/{DOORS_TARGET}</strong></h3>
        <div className='card-container'>
          {
            map(doors, (card, i) => {
              const playable = canPlay(card)
              return (
                <Card
                  key={card}
                  offset={offsets[i]}
                  tiny={true}
                  hovered={playable && this.state.hoveredCard == card}
                  stacked={true}
                  playable={playable}
                  canPlay={canPlay}
                  card={card}
                  play={play}
                  discard={discard}
                />
              )
            })
          }
        </div>
      </div>
    )
  }

  onMouseOut = () => { this.setState({ hoveredCard: null }) }

  onMouseMove = (e) => {
    const { doors } = this.props
    const hoveredCard = calculateHoveredCard(doors, findDOMNode(this), e, OFFSETS.TINY)
    this.setState({ hoveredCard })
  }
}
