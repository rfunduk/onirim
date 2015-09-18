import expect from 'expect'

import { canDiscardAll } from '../../app/lib/rules'

describe( 'rules', function() {

  describe( 'canDiscardAll', function() {
    beforeEach( function() { this.game = {} } )

    it( 'should discard all with a nightmare in limbo', function() {
      this.game.limbo = [ 'NN' ]
      this.game.activeLimbo = 'NN'
      expect( canDiscardAll( this.game ) ).toBeTruthy()
    } )
    it( 'should not discard all with a door in limbo', function() {
      this.game.limbo = [ 'RD' ]
      this.game.activeLimbo = 'RD'
      expect( canDiscardAll( this.game ) ).toBeFalsy()
    } )
    it( 'should not discard all with empty limbo', function() {
      this.game.limbo = []
      this.game.activeLimbo = null
      expect( canDiscardAll( this.game ) ).toBeFalsy()
    } )
  } )

} )
