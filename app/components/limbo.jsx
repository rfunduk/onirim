import classNames from 'classnames'
import { DropTarget } from 'react-dnd'

import shouldPureComponentUpdate from '../utils/pure-render'
import cardOffsets from '../utils/card-offsets'

import map from 'lodash/collection/map'

import Card from './card'

const spec = {
  drop( props, monitor, component ) {
    return { ...monitor.getItem(), target: 'limbo' }
  },
  canDrop( props, monitor ) {
    const { card } = monitor.getItem()
    return props.canPlay( card )
  }
}

@DropTarget( 'card', spec, ( connect, monitor ) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}) )
export default class Limbo extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const { limbo, activeLimbo } = this.props
    const { connectDropTarget, isOver } = this.props
    const classes = classNames( 'limbo', 'play-area', { isOver } )
    const offsets = cardOffsets( limbo, null )

    return connectDropTarget(
      <div className={classes}>
        <div className='card-container'>
          {
            map( limbo, ( card, i ) =>
              <Card key={card}
                    stacked={true}
                    popUp={limbo.length > 1 && card == activeLimbo}
                    offset={offsets[i]}
                    card={card} />
            )
          }
        </div>
      </div>
    )
  }
}
