import {expect, Page} from "@playwright/test";
import {HelperBase} from "./helperBase";

export class HomePage extends HelperBase{

    constructor(page: Page){
        super(page)
    }

    destination = this.page.locator('.transition-colors').locator('.text-nowrap', {hasText: "Hotels"});
    destinationInput = this.page.locator('input[id*="mantine"][id*="target"]').first()
    searchInput = this.page.locator('input[type="text"]').last()

    datePicker = this.page.locator('input[placeholder="Select your dates"]')
    doneButton = this.page.locator('button:has-text("Done")');

    guestsBtn = this.page.locator('.group').getByRole('textbox', {name: 'Travelers'})
    adultPlus = this.page.getByRole('button', {name: "Add Adult"})
    childPlus = this.page.getByRole('button', {name: "Add Child"})

    searchBtn = this.page.getByRole('button',{ name: "Search"})

    async selectDestination(city: string) {
        await this.destination.click();
        await this.destinationInput.click()
        await this.searchInput.fill(city);
        await this.page.locator('div[role="option"]').first().click()
        await expect(this.searchInput).toHaveValue('Miami')
    }

    async selectDates(start: string, end: string) {
        await this.datePicker.click();
        await this.page.getByTestId(`date-${start}`).click();
        await this.page.getByTestId(`date-${end}`).click();
        await this.page.getByRole('button', { name: 'Done' }).click();
    }
    async selectDatesAlt(start: string, end: string) {
        await this.datePicker.click()
        await this.page.locator('[class="mantine-focus-auto mx-10 font-medium text-lg m_f6645d97 mantine-DatePicker-calendarHeaderLevel m_87cf2631 mantine-UnstyledButton-root"]').first().click();
        await this.page.getByTestId('category(static_hotels)_search-form_dates_calendar_day(2026-5-20)').click();
        await this.page.locator('[class="mantine-focus-auto mx-10 font-medium text-lg m_f6645d97 mantine-DatePicker-calendarHeaderLevel m_87cf2631 mantine-UnstyledButton-root"](2026-5-22)').last().click();
    }

    async selectDatesAlternative(checkIn: { month: string, day: number }, checkOut: { month: string, day: number }): Promise<void> {
        // Clicar no campo de datas
        await this.datePicker.click()

        // Navegar até o mês correto (máximo 12 tentativas)
        for (let i = 0; i < 12; i++) {
            const monthHeader = this.page.locator(`button:has-text("${checkIn.month}")`);
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

    async selectGuests(adults: number, children: number) {
        await this.guestsBtn.click();
        for (let i = 1; i < adults; i++) {
            await this.adultPlus.click();
        }
        for (let i = 0; i < children; i++) {
            await this.childPlus.click();
        }
        await this.page.getByRole('textbox', { name: "Child 1 Age"}).click()
    }

    async search() {
        await this.searchBtn.click({timeout: 16000});
        //await this.page.waitForLoadState('networkidle')
        await this.page.waitForTimeout(20000)
        expect(this.page.getByText('Search by Property Name').isVisible())

    }

}