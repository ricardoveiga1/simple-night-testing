
import {expect, Locator, Page} from '@playwright/test';
import {HelperBase} from "./helperBase";

export class HotelPage extends HelperBase{
    constructor(page: Page){
        super(page)
    }

    // price = this.page.getByTestId('hotel-price');
    // score = this.page.getByTestId('hotel-score');
    //
    // async getPrice() {
    //     const text = await this.price.textContent();
    //     return Number(text?.replace(/[^0-9]/g, ''));
    // }
    //
    // async getScore(){
    //     const text = await this.score.textContent();
    //     return Number(text);
    // }

    //price range
    private get cardRoot(): Locator {
        return this.page.locator('[data-map-info-window-id]');
    }

    private get cardArticle(): Locator {
        return this.cardRoot.locator('article[aria-labelledby]');
    }

    private get hotelName(): Locator {
        return this.page.locator('.wrap-anywhere');
    }

    private get ratingValue(): Locator {
        return this.cardArticle.getByText(/^\d+(\.\d+)?$/);
    }

    private get ratingLabel(): Locator {
        return this.cardArticle.getByText(/Excellent|Very Good|Good|Average/);
    }

    private get priceTotal(): Locator {
        return this.cardArticle.locator('span.font-bold');
    }

    private get priceIncludes(): Locator {
        return this.page.getByText('Includes Taxes and Fees');
    }

    async waitForCard() {
        await expect(this.cardRoot).toBeVisible();
        await this.cardRoot.scrollIntoViewIfNeeded();
        await expect(this.cardRoot).toBeInViewport();
    }

    async validateBasicInfo() {
        await expect(this.hotelName).toBeVisible();
        await expect(this.ratingValue).toHaveText(/\d+(\.\d+)?/);
        await expect(this.ratingLabel).toHaveText(/Excellent|Very Good|Good|Average/);
        await expect(this.priceTotal.first()).toBeVisible();
        await expect(this.priceIncludes).toBeVisible();
    }

    async validatePriceRange(min: number, max: number) {
        const priceText = await this.priceTotal.innerText();
        const price = parseFloat(priceText.replace(/[^0-9]/g, ''));
        expect(price).toBeGreaterThanOrEqual(min);
        expect(price).toBeLessThanOrEqual(max);
    }

    //building
    async validateGuestScore(minRating: number) {
        const scoreText = await this.ratingValue.textContent();
        const score = parseFloat(scoreText?.trim() || 'NaN');
        expect(score).toBeGreaterThanOrEqual(minRating);
    }

    //switch to map view
    private get layoutDropdownTrigger() {
        return this.page.locator('[data-testid="category(static_hotels)_search-results_layout-select_trigger"]');
    }

    private layoutOption() {
        return this.page.locator('[data-testid="category(static_hotels)_search-results_layout-select_option(map)"]');
    }

    async switchLayoutMap() {
        await this.layoutDropdownTrigger.click();
        await this.layoutOption().click();
    }

    //score
    private guestScoreFilter(label: string) {
        return this.page.locator('label').filter({ hasText: label });
    }

    async setGuestScore(minRating: number) {
        let label = '';
        if (minRating >= 9) label = 'Excellent (9+)';
        else if (minRating >= 7) label = 'Very Good (7+)';
        else if (minRating >= 5) label = 'Good (5+)';
        else label = 'Average (5-)';
        await this.guestScoreFilter(label).click();

        await this.waitNumberOfSeconds((10))
    }


    async setPriceRange(min: number, max: number) {
        // await this.priceSliderMin.fill(min.toString());
        // await this.priceSliderMax.fill(max.toString());
        // await this.page.waitForTimeout(1000);

        const priceSlider = this.page.locator('[class="mt-2 m_dd36362e mantine-Slider-root"]').getByRole('slider')
        await priceSlider.evaluate(node => {
            node.setAttribute("aria-valuenow", min.toString())
            node.setAttribute("aria-valuenow", max.toString())
        })
        await priceSlider.click()
        // const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
        // await expect(tempBox).toContainText("30")
    }

}

