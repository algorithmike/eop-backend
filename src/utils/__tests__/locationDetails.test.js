import "regenerator-runtime/runtime.js"
import getLocFromCoords from '../locationDetails'

test('getLocFromCoords with proper coordinates returns expected location data', async () => {
    const data = await getLocFromCoords('36.6002', '-121.8947');

    expect(data).toEqual({
        country: 'United States',
        state: 'California 93940',
        city: 'Monterey',
        streetAddress: '140 West Franklin Street',
        landmark: 'West Franklin Street'
      })
})