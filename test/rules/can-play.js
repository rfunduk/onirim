import expect from 'expect'
import { canPlay } from '../../app/lib/rules'

describe( 'rules', function() {

  describe( 'canPlay', function() {
    beforeEach( function() {
      this.game = {
        hand: [ 'RM', 'RS', 'RK', 'BK', 'GM' ],
        labyrinth: [ 'RS' ]
      }
    } )

    describe( 'empty limbo', function() {
      beforeEach( function() {
        this.game.limbo = []
      } )

      describe( 'full hand', function() {
        it( 'should allow playing a new symbol', function() {
          expect( canPlay( this.game, 'RM' ) ).toBeTruthy()
        } )
        it( 'should disallow playing the same symbol', function() {
          expect( canPlay( this.game, 'RS' ) ).toBeFalsy()
        } )
      } )

      describe( 'partial hand', function() {
        it( 'should disallow playing', function() {
          expect( canPlay( this.game, 'RS' ) ).toBeFalsy()
        } )
      } )

      it( 'should not allow playing doors', function() {
        this.game.doors = [ 'RD' ]
        expect( canPlay( this.game, 'RD' ) ).toBeFalsy()
      } )

    } )

    describe( 'non-empty limbo', function() {

      describe( 'active door', function() {
        beforeEach( function() {
          this.game.limbo = [ 'RD' ]
          this.game.activeLimbo = 'RD'
        } )

        it( 'should allow playing a key of the same color', function() {
          expect( canPlay( this.game, 'RK' ) ).toBeTruthy()
        } )
        it( 'should not allow playing a key of a different color', function() {
          expect( canPlay( this.game, 'BK' ) ).toBeFalsy()
        } )
        it( 'should not allow playing non-keys', function() {
          expect( canPlay( this.game, 'RS' ) ).toBeFalsy()
        } )
      } )

      describe( 'inactive door', function() {
        beforeEach( function() {
          this.game.limbo = [ 'RD' ]
          this.game.activeLimbo = null
        } )

        it( 'should not allow playing anything', function() {
          expect( canPlay( this.game, 'RK' ) ).toBeFalsy()
          expect( canPlay( this.game, 'BK' ) ).toBeFalsy()
          expect( canPlay( this.game, 'RS' ) ).toBeFalsy()
        } )
      } )

      describe( 'active nightmare', function() {
        beforeEach( function() {
          this.game.limbo = [ 'NN' ]
          this.game.activeLimbo = 'NN'
        } )

        it( 'should allow playing any key', function() {
          expect( canPlay( this.game, 'RK' ) ).toBeTruthy()
          expect( canPlay( this.game, 'BK' ) ).toBeTruthy()
        } )

        it( 'should not allow playing non-keys', function() {
          expect( canPlay( this.game, 'RS' ) ).toBeFalsy()
        } )

        it( 'should allow playing a door', function() {
          this.game.doors = [ 'RD' ]
          expect( canPlay( this.game, 'RD' ) ).toBeTruthy()
        } )
      } )

      describe( 'inactive nightmare', function() {
        beforeEach( function() {
          this.game.limbo = [ 'NN' ]
          this.game.activeLimbo = null
        } )

        it( 'should not allow playing anything', function() {
          expect( canPlay( this.game, 'RK' ) ).toBeFalsy()
          expect( canPlay( this.game, 'BK' ) ).toBeFalsy()
          expect( canPlay( this.game, 'RS' ) ).toBeFalsy()
        } )
      } )

    } )

  } )

} )
