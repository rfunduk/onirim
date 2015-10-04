import expect from 'expect'

import { canDraw } from '../../app/lib/rules'

describe( 'rules', function() {

  describe( 'canDraw', function() {
    beforeEach( function() {
      this.game = {
        limbo: [],
        deck: [ 'BM' ],
        hand: [ 'RM', 'RS', 'RK', 'BK' ]
      }
    } )

    describe( 'partial hand', function() {
      it( 'can draw from a non-empty deck', function() {
        expect( canDraw( this.game ) ).toBeTruthy()
      } )
      it( 'cannot draw from an empty deck', function() {
        const game = { ...this.game, deck: [] }
        expect( canDraw( game ) ).toBeFalsy()
      } )

      it( 'can draw when limbo is empty', function() {
        const game = { ...this.game, limbo: [] }
        expect( canDraw( game ) ).toBeTruthy()
      } )
      it( 'cannot draw when limbo has a nightmare', function() {
        const game = { ...this.game, limbo: [ 'NN' ], activeLimbo: 'NN' }
        expect( canDraw( game ) ).toBeFalsy()
      } )
      it( 'can draw when limbo has an active door', function() {
        const game = { ...this.game, limbo: [ 'RD' ], activeLimbo: 'RD' }
        expect( canDraw( game ) ).toBeTruthy()
      } )
      it( 'can draw when limbo has a non-active door', function() {
        const game = { ...this.game, activeLimbo: 'RD' }
        expect( canDraw( game ) ).toBeTruthy()
      } )

      it( 'cannot draw during a prophecy', function() {
        const game = { ...this.game, prophecy: [ 1, 2, 3, 4 ] }
        expect( canDraw( game ) ).toBeFalsy()
      } )
    } )
  } )

} )
