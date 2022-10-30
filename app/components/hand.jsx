import shouldPureComponentUpdate from '../utils/pure-render'

import map from 'lodash/collection/map'

import Card from './card'

export default class Hand extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const { hand } = this.props
    const { canPlay } = this.props
    const { play, discard } = this.props

    return (
      <div className='hand play-area'>
        <div className='card-container'>
          {
            map(hand, (card, i) =>
              <Card
                key={card} card={card}
                index={i}
                stacked={false}
                playable={true}
                canPlay={canPlay}
                play={play}
                discard={discard}
              />
            )
          }
        </div>
      </div>
    )
  }
}
