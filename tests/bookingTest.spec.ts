import {expect, test} from '@playwright/test'
import { PageManager } from '../pages/pageManager'
import {HomePage} from "../pages/homePage";
import {ResultsPage} from "../pages/resultPage";
import {HotelPage} from "../pages/hotelPage";
import {validatePrice, validateScore} from "../pages/validateHelper";



test.beforeEach( async ({page}) => {
    await page.goto('/')
})

test('booking hotel in Miami', async ({page}) => {

    test.setTimeout(10000)
    test.slow()
    const home = new HomePage(page);
    const results = new ResultsPage(page);
    const hotel = new HotelPage(page);

    //await home.open();

    await home.selectDestination('Miami');
    //await home.selectDates('2026-03-20', '2026-03-22');

    //await home.selectDatesIA({ month: 'May 2026', day: 20 }, { month: 'May 2026', day: 23 });
    await home.selectGuests(1, 1);
    await home.search();

    //await results.setPriceRange(100, 1000);
    await results.applyPriceRangeFilter(100, 1000)
    //await results.applyGuestScore(); // very good
    await results.selectMap(2);
    await results.zoomInMap()
    await results.selectAnyHotel();

    const price = await hotel.getPrice();
    const score = await hotel.getScore();

    expect(validatePrice(price, 100, 1000)).toBe(true);
    expect(validateScore(score)).toBe(true);


})