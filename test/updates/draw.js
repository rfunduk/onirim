import expect from 'expect'
import { draw } from '../../app/lib/updates'
import { LOST } from '../../app/lib/constants'

describe( 'updates', function() {

  describe( 'draw', function() {
    beforeEach( function() {
      this.game = {
        limbo: [],
        hand: []
      }
    } )

    it( 'should reset activeLimbo', function() {
      this.game.activeLimbo = 1
      this.game.deck = [ 'RM' ]
      const { activeLimbo } = draw( this.game )
      expect( activeLimbo ).toEqual( null )
    } )

    it( 'draws a door into limbo', function() {
      this.game.deck = [ 'RD' ]
      const { hand, limbo } = draw( this.game )
      expect( hand ).toNotContain( 'RD' )
      expect( limbo ).toContain( 'RD' )
    } )

    it( 'draws a nightmare into limbo', function() {
      this.game.deck = [ 'NN' ]
      const { hand, limbo } = draw( this.game )
      expect( hand ).toNotContain( 'NN' )
      expect( limbo ).toContain( 'NN' )
    } )

    it( 'draws others into your hand', function() {
      this.game.deck = [ 'BM' ]
      const { hand, limbo } = draw( this.game )
      expect( limbo ).toNotContain( 'BM' )
      expect( hand ).toContain( 'BM' )
    } )

    it( 'ends the game in a loss when no cards are left', function() {
      this.game.deck = []
      const { status } = draw( this.game )
      expect( status ).toEqual( LOST )
    } )
  } )

} )
