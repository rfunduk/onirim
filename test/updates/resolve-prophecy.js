import expect from 'expect'
import last from 'lodash/array/last'
import { resolveProphecy } from '../../app/lib/updates'

describe( 'updates', function() {

  describe( 'resolveProphecy', function() {
    beforeEach( function() {
      this.game = {
        lastProphecySize: 5,
        prophecy: [ 1, 2, 3, 4 ],
        deck: [ 5, 6 ]
      }
    } )

    it( 'resets lastProphecySize', function() {
      const { lastProphecySize } = resolveProphecy( this.game )
      expect( lastProphecySize ).toEqual( null )
    } )

    it( 'resets prophecy cards', function() {
      const { prophecy } = resolveProphecy( this.game )
      expect( prophecy.length ).toEqual( 0 )
    } )

    it( 'put the prophecy cards on top of the deck, last first', function() {
      const { deck } = resolveProphecy( this.game )
      expect( deck.length ).toEqual( this.game.prophecy.length + this.game.deck.length )
      expect( deck[0] ).toEqual( last(this.game.prophecy) )
    } )
  } )

} )
