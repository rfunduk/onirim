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
      const game = { ...this.game, limbo: [] }
      expect( canShuffle( game ) ).toBeFalsy()
    } )
    it( 'should not shuffle with a non-full hand', function() {
      const game = { ...this.game, limbo: [ 'RD' ], activeLimbo: 'RD', hand: this.game.hand.slice(0, -1) }
      expect( canShuffle( game ) ).toBeFalsy()
    } )
    it( 'should not shuffle with an active nightmare', function() {
      const game = { ...this.game, limbo: [ 'NN' ], activeLimbo: 'NN' }
      expect( canShuffle( game ) ).toBeFalsy()
    } )

    it( 'should shuffle with a full hand and an active door in limbo', function() {
      const game = { ...this.game, limbo: [ 'RD' ], activeLimbo: 'RD' }
      expect( canShuffle( game ) ).toBeTruthy()
    } )
    it( 'should shuffle with a full hand and a non-active door in limbo', function() {
      const game = { ...this.game, limbo: [ 'RD' ], activeLimbo: null }
      expect( canShuffle( game ) ).toBeTruthy()
    } )
  } )

} )
