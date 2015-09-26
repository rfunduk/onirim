import expect from 'expect'

import { isInProphecy } from '../../app/lib/rules'

describe( 'rules', function() {

  describe( 'isInProphecy', function() {
    beforeEach( function() {
      this.game = {
        prophecy: [ 1, 2, 3, 4, 5 ],
        lastProphecySize: 5
      }
    } )

    it( 'should return true when the card is in the prophecy', function() {
      expect( isInProphecy( this.game, 2 ) ).toBeTruthy()
    } )
    it( 'should return false when the card is not in the prophecy', function() {
      expect( isInProphecy( this.game, 1000 ) ).toBeFalsy()
    } )
  } )

} )
