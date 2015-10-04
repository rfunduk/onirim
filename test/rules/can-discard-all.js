import expect from 'expect'

import { canDiscardAll } from '../../app/lib/rules'

describe( 'rules', function() {

  describe( 'canDiscardAll', function() {
    beforeEach( function() { this.game = {} } )

    it( 'should discard all with a nightmare in limbo', function() {
      const game = { ...this.game, activeLimbo: 'NN', limbo: [ 'NN' ] }
      expect( canDiscardAll( game ) ).toBeTruthy()
    } )
    it( 'should not discard all with a door in limbo', function() {
      const game = { ...this.game, activeLimbo: 'RD', limbo: [ 'RD' ] }
      expect( canDiscardAll( game ) ).toBeFalsy()
    } )
    it( 'should not discard all with empty limbo', function() {
      const game = { ...this.game, activeLimbo: null, limbo: [] }
      expect( canDiscardAll( game ) ).toBeFalsy()
    } )
  } )

} )
