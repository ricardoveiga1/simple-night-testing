import {expect, Page} from "@playwright/test";


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


    // Retorna o nome do mês (1-based)
    private monthName(month: number): string {
        const names = [
            'Jan','Feb','Mar','Apr','May','Jun',
            'Jul','Aug','Sep','Oct','Nov','Dec'
        ];
        return names[month - 1] ?? '';
    }

    // set date (start and end)
    async pickDateRange(start: string, end: string) {
        await this.datePickerTrigger.click();
        await this.page.waitForTimeout(300);

        const selectDate = async (dateStr: string) => {
            const [year, month, day] = dateStr.split('-');
            const targetMonthLabel = `${this.monthName(Number(month))} ${year}`;

            const header = this.page.getByRole('button', {
                name: `${this.monthName(Number(month))} ${year}`,
                exact: true,
            });

            const dayButton = this.page.getByRole('button', {
                name: `${Number(day)} ${this.monthName(Number(month))} ${year}`,
                exact: true,
            });
            console.log("header" + header)
            console.log("day" + dayButton)
            console.log("target month label" + targetMonthLabel)


            let attempts = 0;
            while (!(await header.isVisible()) && attempts < 12) {
                await this.page.locator('button[data-direction="next"]').click();
                await this.page.waitForTimeout(150);
                attempts++;
            }

            await expect(header).toBeVisible({ timeout: 2000 });

            // click day
            await dayButton.click();
            await expect(dayButton).toHaveAttribute('data-selected', 'true', { timeout: 2000 });

            await this.waitNumberOfSeconds(5)
        };

        // select start and end dates
        await selectDate(start);
        await selectDate(end);

        // finalize date selection
        if (await this.dateDoneButton.isVisible()) {
            await this.dateDoneButton.click();
        }
    }

}