import {expect, Page} from "@playwright/test";
import {HelperBase} from "./helperBase";

export class HomePage extends HelperBase{

    constructor(page: Page){
        super(page)
    }

    // navbar -> Hotels
    private get hotelsCategory() {
        return this.page.getByTestId('category-search-bar-tab(static_hotels)');
    }

    // destination trigger (opens dropdown)
    private get destinationTrigger() {
        return this.page.getByTestId('category(static_hotels)_search-form_location_trigger');
    }

    // destination input (filled after trigger is open)
    private get destinationInput() {
        return this.page.getByTestId('category(static_hotels)_search-form_location_input');
    }

    // destination suggestion (parametrized by text)
    private destinationSuggestion(destination: string) {
        return this.page.locator('div.flex.items-center.gap-x-2').filter({
            has: this.page.getByText(destination, { exact: true }),
        });
    }


    // Guests trigger
    private get guestsTrigger() {
        return this.page.getByTestId('category(static_hotels)_search-form_guests_trigger');
    }

    private get addAdultButton() {
        return this.page.getByRole('button', { name: 'Add Adult' });
    }

    private get addChildButton() {
        return this.page.getByRole('button', { name: 'Add Child' });
    }

    // search button
    private get searchButton() {
        return this.page.getByRole('button', { name: 'Search' });
    }


    // actions ------------------------->

    // selects hotels in navbar
    async selectHotelsCategory() {
        await this.hotelsCategory.click();
    }

    // fill destination
    async enterLocation(destination: string) {
        await this.destinationTrigger.click();
        await this.destinationInput.fill(destination);

        const suggestion = this.destinationSuggestion(destination);
        await suggestion.first().waitFor({ state: 'visible' });
        await suggestion.first().click();
    }

    // sets number of guests
    async setGuests(adults: number, children: number) {
        await this.guestsTrigger.click();

        for (let i = 1; i < adults; i++) {
            await this.addAdultButton.click();
        }

        for (let i = 0; i < children; i++) {
            await this.addChildButton.click();
        }
    }

    // click search button
    async search() {
        await this.searchButton.click();
    }

    async pickDateRange(start: string, end: string): Promise<void> {
        super.pickDateRange(start, end);
    }
}