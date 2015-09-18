import expect from 'expect'

import { canShuffle } from '../../app/lib/rules'

describe( 'rules', function() {

  describe( 'canShuffle', function() {
    beforeEach( function() {
      this.game = {
        hand: [ 1, 2, 3, 4, 5 ]
      }
    } )

    it( 'should not shuffle with emptly limbo', function() {
      this.game.limbo = []
      expect( canShuffle( this.game ) ).toBeFalsy()
    } )
    it( 'should not shuffle with a non-full hand', function() {
      this.game.limbo = [ 'RD' ]
      this.game.activeLimbo = 'RD'
      this.game.hand.pop()
      expect( canShuffle( this.game ) ).toBeFalsy()
    } )
    it( 'should not shuffle with an active nightmare', function() {
      this.game.limbo = [ 'NN' ]
      this.game.activeLimbo = 'NN'
      expect( canShuffle( this.game ) ).toBeFalsy()
    } )

    it( 'should shuffle with a full hand and an active door in limbo', function() {
      this.game.limbo = [ 'RD' ]
      this.game.activeLimbo = 'RD'
      expect( canShuffle( this.game ) ).toBeTruthy()
    } )
    it( 'should shuffle with a full hand and a non-active door in limbo', function() {
      this.game.limbo = [ 'RD' ]
      this.game.activeLimbo = null
      expect( canShuffle( this.game ) ).toBeTruthy()
    } )
  } )

} )
