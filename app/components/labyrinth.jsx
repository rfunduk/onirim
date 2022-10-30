import classNames from 'classnames'
import { DropTarget } from 'react-dnd'

import shouldPureComponentUpdate from '../utils/pure-render'
import cardOffsets from '../utils/card-offsets'

import map from 'lodash/collection/map'

import Card from './card'

const spec = {
  drop(props, monitor, component) {
    return { ...monitor.getItem(), target: 'labyrinth' }
  },
  canDrop(props, monitor) {
    const { card } = monitor.getItem()
    return props.canPlay(card)
  }
}

@DropTarget('card', spec, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class Labyrinth extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  state = { hoveredCard: null }

  render() {
    const { labyrinth } = this.props
    const { isOver, connectDropTarget } = this.props
    const classes = classNames('labyrinth', 'play-area', { isOver })

    const toCompress = labyrinth.length > 10 ? 5 : 20
    const offsets = cardOffsets(labyrinth, toCompress)

    return connectDropTarget(
      <div className={classes}>
        <div className='card-container'>
          {
            map(labyrinth, (card, i) =>
              <Card
                key={card}
                offset={offsets[i]}
                hovered={this.state.hoveredCard == card}
                stacked={true}
                card={card}
              />
            )
          }
        </div>
      </div>
    )
  }
}
