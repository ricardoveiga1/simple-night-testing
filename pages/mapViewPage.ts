import {expect, Page} from "@playwright/test";
import {HelperBase} from "./helperBase";

export class MapViewPage extends HelperBase{
    constructor(page: Page){
        super(page)
    }

    private get hotelMarkers() {
        return this.page.locator('gmp-advanced-marker');
    }

    private get mapContainer() {
        return this.page.getByTestId('map');
    }

    private get loadMoreButton() {
        return this.page.getByRole('button', {name: 'Load More'});
    }

    async waitForMapReady() {
        await Promise.all([
            expect(this.loadMoreButton).toBeVisible(),
            expect(this.mapContainer).toBeVisible(),
        ]);
        await this.page.evaluate(() => window.scrollTo(0, 0));
        await this.waitNumberOfSeconds(10)
    }

    async zoomUntilMarkers(minMarkers: number = 2, maxTries: number = 10) {
        let tries = 0;
        while (tries < maxTries) {
            const count = await this.hotelMarkers.count();

            if (count >= minMarkers) {
                return;
            }
            await this.mapContainer.hover();
            await this.page.mouse.wheel(0, -7500);
            await this.page.waitForTimeout(1000);
            tries++;
        }
        await expect(this.hotelMarkers.first()).toBeVisible();
    }

    async selectHotelMarker() {
        await this.zoomUntilMarkers(6);

        const marker = this.hotelMarkers.first();
        const maxRetries = 3;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            await marker.scrollIntoViewIfNeeded();
            await expect(marker).toBeVisible();

            await marker.click({force: true});

            const card = this.page.locator('[data-map-info-window-id]');
            if (await card.isVisible({timeout: 2000}).catch(() => false)) {
                return;
            }
            await this.page.waitForTimeout(2000);
        }
        throw new Error('Failed to open hotel card after retries');
    }
}