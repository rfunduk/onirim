import expect from 'expect'
import { discardAll } from '../../app/lib/updates'
import { LOST } from '../../app/lib/constants'

describe( 'updates', function() {

  describe( 'discardAll', function() {
    beforeEach( function() {
      this.game = {
        deck: [ 1, 2, 3, 4, 5 ],
        limbo: [ 'RD', 'NN' ],
        hand: [ 6 ],
        discarded: []
      }
    } )

    it( 'should reset activeLimbo', function() {
      const game = { ...this.game, activeLimbo: 'NN' }
      const { activeLimbo } = discardAll( game )
      expect( activeLimbo ).toEqual( null )
    } )

    it( 'should replace your hand', function() {
      const { hand, deck } = discardAll( this.game )
      expect( hand ).toNotContain( 6 )
      expect( hand.length ).toEqual( 5 )
    } )
    it( 'should shuffle the door back into the deck', function() {
      const { deck } = discardAll( this.game )
      expect( deck ).toContain( 'RD' )
    } )
    it( 'should discard the nightmare', function() {
      const { discarded } = discardAll( this.game )
      expect( discarded ).toContain( 'NN' )
    } )

    it( 'should be game over if we run out of cards', function() {
      const game = { ...this.game, deck: [ 1, 2, 3 ] }
      const { status } = discardAll( game )
      expect( status ).toEqual( LOST )
    } )

  } )

} )
