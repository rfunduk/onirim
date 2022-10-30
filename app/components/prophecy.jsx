import classNames from 'classnames'

import shouldPureComponentUpdate from '../utils/pure-render'

import map from 'lodash/collection/map'

import Card from './card'

export default class Limbo extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const { isInProphecy } = this.props
    const { reorderProphecy, discard } = this.props
    const classes = classNames('prophecy', 'play-area')

    return (
      <div className={classes}>
        <div className='card-container'>
          {
            map(this.props.prophecy, card =>
              <Card
                key={card} card={card}
                discard={discard}
                orderable={true}
                reorderProphecy={reorderProphecy}
                isInProphecy={isInProphecy}
              />
            )
          }
        </div>
      </div>
    )
  }
}
