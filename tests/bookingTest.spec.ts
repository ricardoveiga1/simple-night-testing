import {test} from '../test-options'
import {HelperBase} from "../pages/helperBase";

test('booking hotel in Miami', async ({pageManager, goHomePage}) => {

    await pageManager.onHomePage().selectHotelsCategory()
    await pageManager.onHomePage().enterLocation('Miami');
    //await pageManager.onHomePage().pickDateRange('2026-05-20', '2026-05-22');

    //await pageManager.onHomePage().selectDatesAlternative({ month: 'May 2026', day: 20 }, { month: 'May 2026', day: 23 });
    await pageManager.onHomePage().setGuests(1, 1);
    await pageManager.onHomePage().search();

    await pageManager.onHotelPage().switchLayoutMap()
    await pageManager.onHotelPage().setGuestScore(7)

    //set price range building

    await pageManager.onMapViewPage().waitForMapReady()
    await pageManager.onMapViewPage().zoomUntilMarkers()
    await pageManager.onMapViewPage().selectHotelMarker()

    await pageManager.onHotelPage().waitForCard()
    await pageManager.onHotelPage().validateBasicInfo()
    await pageManager.onHotelPage().validatePriceRange(100, 1000)
})