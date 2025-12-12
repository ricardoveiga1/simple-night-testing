import {expect, Locator, Page} from "@playwright/test";


export class HelperBase {

    readonly page: Page

    constructor(page: Page){
        this.page = page
    }

    async waitNumberOfSeconds(timeInSeconds: number){
        await this.page.waitForTimeout(timeInSeconds * 1000)
    }


    private get datePickerTrigger() {
        return this.page.getByTestId('category(static_hotels)_search-form_dates_trigger');
    }

    // Date confirmation button
    private get dateDoneButton() {
        return this.page.getByTestId('category(static_hotels)_search-form_dates_apply-button');
    }

    //category(static_hotels)_search-form_dates_calendar_day(2026-3-18)
    // set date (start and end)
    async pickDateRange(start: string, end: string) {
        await this.datePickerTrigger.click();
        await this.page.waitForTimeout(500);


        const selectDate = async (dateStr: string) => {
            const [year, month, day] = dateStr.split('-');

            const dayButton = this.page.getByRole('button', {
                name: `${Number(day)} ${this.monthName(Number(month))} ${year}`,
                exact: true,
            });

            const header = this.page.getByRole('button', {
                name: `${this.monthName(Number(month))} ${year}`,
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
}