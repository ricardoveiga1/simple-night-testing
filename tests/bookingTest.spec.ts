import {expect} from '@playwright/test'
import {validatePrice, validateScore} from "../pages/validateHelper";
import {test} from '../test-options'


test('booking hotel in Miami', async ({pageManager, goHomePage}) => {

    test.slow()
    await pageManager.onHomePage().selectDestination('Miami');
    //await home.selectDates('2026-03-20', '2026-03-22');

    //await home.selectDatesIA({ month: 'May 2026', day: 20 }, { month: 'May 2026', day: 23 });
    await pageManager.onHomePage().selectGuests(1, 1);
    await pageManager.onHomePage().search();

    //await results.setPriceRange(100, 1000);
    await pageManager.onResultPage().applyPriceRangeFilter(100, 1000)
    //await results.applyGuestScore(); // very good
    await pageManager.onResultPage().selectMap(2);
    await pageManager.onResultPage().zoomInMap()
    await pageManager.onResultPage().selectAnyHotel();

    const price = await pageManager.onHotelPage().getPrice();
    const score = await pageManager.onHotelPage().getScore();

    expect(validatePrice(price, 100, 1000)).toBe(true);
    expect(validateScore(score)).toBe(true);

})