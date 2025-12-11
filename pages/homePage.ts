import {expect, Page} from "@playwright/test";
import {HelperBase} from "./helperBase";

export class HomePage extends HelperBase{

    constructor(page: Page){
        super(page)
    }

    // Navbar -> Hotels
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

    private get datePickerTrigger() {
        return this.page.getByTestId('category(static_hotels)_search-form_dates_trigger');
    }

    // Date confirmation button
    private get dateDoneButton() {
        return this.page.getByTestId('category(static_hotels)_search-form_dates_apply-button');
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

    // Sets number of guests
    async setGuests(adults: number, children: number) {
        await this.guestsTrigger.click();

        for (let i = 1; i < adults; i++) {
            await this.addAdultButton.click();
        }

        for (let i = 0; i < children; i++) {
            await this.addChildButton.click();
        }
    }

    // click
    async search() {
        await this.searchButton.click();
    }


    // set date (start and end)
    async pickDateRange(start: string, end: string) {
        await this.datePickerTrigger.click();
        await this.page.waitForTimeout(300);

        const selectDate = async (dateStr: string) => {
            const [year, month, day] = dateStr.split('-');

            const dayButton = this.page.getByRole('button', {
                name: '{Number(day)} ${this.monthName(Number(month))} ${year}',
                exact: true,
            });

            const header = this.page.getByRole('button', {
                name: '{this.monthName(Number(month))} ${year}',
                exact: true,
            });

            let tries = 0;
            while (!(await header.isVisible()) && tries < 24) {
                await this.page.locator('button[data-direction="next"]').click();
                await this.page.waitForTimeout(200);
                tries++;
            }

            await dayButton.click();
            await expect(dayButton).toHaveAttribute('data-selected', 'true', {timeout: 2000});
            await this.page.waitForTimeout(300);
        };

        await selectDate(start);
        await selectDate(start);
        await selectDate(end);

        if (await this.dateDoneButton.isVisible()) {
            await this.dateDoneButton.click();
        }
    }



    doneButton = this.page.locator('button:has-text("Done")');
    async selectDatesAlternative(checkIn: { month: string, day: number }, checkOut: { month: string, day: number }) {
        // Clicar no campo de datas
        await this.datePickerTrigger.click()
        await this.page.waitForTimeout(300);

        // Navegar até o mês correto (máximo 12 tentativas)
        for (let i = 0; i < 12; i++) {
            const monthHeader = this.page.getByRole('button', {
                name: '{this.monthName(Number(month))} ${year}',
                exact: true,
            });
            const isVisible = await monthHeader.isVisible().catch(() => false);
            if (isVisible) break;

            // Clicar na seta para avançar
            const nextArrows = this.page.locator('button').filter({ hasText: '' });
            const count = await nextArrows.count();
            if (count > 2) {
                await nextArrows.nth(2).click();
            }
            await this.page.waitForTimeout(800);
        }

        // waiting
        await this.page.waitForTimeout(1000);

        // select datae check-in - tentar diferentes formatos
        let checkInButton = this.page.locator(`button[aria-label*="${checkIn.day} ${checkIn.month}"]`);
        let isVisible = await checkInButton.isVisible().catch(() => false);

        if (!isVisible) {
            // Tentar formato alternativo
            const monthName = checkIn.month.split(' ')[0];
            checkInButton = this.page.locator(`button[aria-label*="${checkIn.day} ${monthName}"]`);
        }

        await checkInButton.click();
        await this.page.waitForTimeout(800);

        // select date check-out
        const monthName = checkOut.month.split(' ')[0];
        let checkOutButton = this.page.locator(`button[aria-label*="${checkOut.day} ${monthName}"]`)
        isVisible = await checkOutButton.isVisible().catch(() => false);

        if (!isVisible) {
            checkOutButton = this.page.locator(`button[aria-label*="${checkOut.day} ${checkOut.month}"]`)
        }
        await checkOutButton.click()


        await this.doneButton.click()
    }
}