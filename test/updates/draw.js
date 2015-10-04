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
      const game = { ...this.game, activeLimbo: 1, deck: [ 'RM' ] }
      const { activeLimbo } = draw( game )
      expect( activeLimbo ).toEqual( null )
    } )

    it( 'draws a door into limbo', function() {
      const game = { ...this.game, deck: [ 'RD' ] }
      const { hand, limbo } = draw( game )
      expect( hand ).toNotContain( 'RD' )
      expect( limbo ).toContain( 'RD' )
    } )

    it( 'draws a nightmare into limbo', function() {
      const game = { ...this.game, deck: [ 'NN' ] }
      const { hand, limbo } = draw( game )
      expect( hand ).toNotContain( 'NN' )
      expect( limbo ).toContain( 'NN' )
    } )

    it( 'draws others into your hand', function() {
      const game = { ...this.game, deck: [ 'BM' ] }
      const { hand, limbo } = draw( game )
      expect( limbo ).toNotContain( 'BM' )
      expect( hand ).toContain( 'BM' )
    } )

    it( 'ends the game in a loss when no cards are left', function() {
      const game = { ...this.game, deck: [] }
      const { status } = draw( game )
      expect( status ).toEqual( LOST )
    } )
  } )

} )
