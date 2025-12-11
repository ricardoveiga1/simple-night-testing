import {test} from '../test-options'

test('booking hotel in Miami', async ({pageManager, goHomePage}) => {

    test.slow()
    await pageManager.onHomePage().selectHotelsCategory()
    await pageManager.onHomePage().enterLocation('Miami');
    //await pageManager.onHomePage().pickDateRange('2026-05-20', '2026-05-22');

    //await pageManager.onHomePage().selectDatesAlternative({ month: 'May 2026', day: 20 }, { month: 'May 2026', day: 23 });
    await pageManager.onHomePage().setGuests(1, 1);
    await pageManager.onHomePage().search();

    await pageManager.onHotelPage().switchLayoutMap()
    await pageManager.onHotelPage().setGuestScore(7)
    //await pageManager.onMapViewPage().zoomUntilMarkers()

    await pageManager.onMapViewPage().waitForMapReady()
    //await pageManager.onMapViewPage().zoomUntilMarkers()

    //await results.setPriceRange(100, 1000);
    // await pageManager.onResultPage().applyPriceRangeFilter(100, 1000)
    // //await results.applyGuestScore(); // very good
    // //await pageManager.onResultPage().selectMap(2);
    // await pageManager.onResultPage().zoomInMap()
    // await pageManager.onResultPage().selectAnyHotel();
    //
    // const price = await pageManager.onHotelPage().getPrice();
    // const score = await pageManager.onHotelPage().getScore();
    //
    // expect(validatePrice(price, 100, 1000)).toBe(true);
    // expect(validateScore(score)).toBe(true);

})