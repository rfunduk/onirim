import expect from 'expect'
import last from 'lodash/array/last'
import { reorderProphecy } from '../../app/lib/updates'

describe( 'updates', function() {

  describe( 'reorderProphecy', function() {
    beforeEach( function() {
      this.game = {
        prophecy: [ 'A', 'B', 'C', 'D' ]
      }
    } )

    it( 'moves last to first', function() {
      const { prophecy } = reorderProphecy( this.game, 'D', 'A' )
      expect( prophecy ).toEqual( [ 'D', 'A', 'B', 'C' ] )
    } )

    it( 'moves first to last', function() {
      const { prophecy } = reorderProphecy( this.game, 'A', 'D' )
      expect( prophecy ).toEqual( [ 'B', 'C', 'D', 'A' ] )
    } )

    it( 'moves last to middle', function() {
      const { prophecy } = reorderProphecy( this.game, 'D', 'B' )
      expect( prophecy ).toEqual( [ 'A', 'D', 'B', 'C' ] )
    } )
  } )

} )
