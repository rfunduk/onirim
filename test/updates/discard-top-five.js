import expect from 'expect'
import { discardTopFive } from '../../app/lib/updates'
import { LOST } from '../../app/lib/constants'

describe( 'updates', function() {

  describe( 'discardTopFive', function() {
    beforeEach( function() {
      this.game = {
        deck: [ 'RD', 'NN-1', 'RS', 'RM', 'RK', 'BM', 'BS', 'YS', 'YM' ],
        limbo: [ 'RD', 'NN-2' ],
        activeLimbo: [ 'NN-2' ],
        hand: [],
        discarded: []
      }
    } )

    it( 'should not discard doors and nightmares', function() {
      const { discarded, deck } = discardTopFive( this.game )
      expect( discarded ).toNotContain( 'NN-1' )
      expect( discarded ).toNotContain( 'ND' )
      expect( deck ).toContain( 'RS' )
    } )

    it( 'should reset activeLimbo', function() {
      const { activeLimbo } = discardTopFive( this.game )
      expect( activeLimbo ).toEqual( null )
    } )

    it( 'should shuffle the door back into the deck', function() {
      let { deck } = discardTopFive( this.game )
      expect( deck ).toContain( 'RD' )
    } )
    it( 'should discard the nightmare', function() {
      let { discarded } = discardTopFive( this.game )
      expect( discarded ).toContain( 'NN-2' )
    } )

    it( 'should be game over if we run out of cards', function() {
      this.game.deck = [ 'RM', 'RS' ]
      let { status } = discardTopFive( this.game )
      expect( status ).toEqual( LOST )
    } )

  } )

} )
