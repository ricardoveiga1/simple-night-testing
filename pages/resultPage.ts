// results page
import {expect, Page} from '@playwright/test';
import {HelperBase} from "./helperBase";

export class ResultsPage extends HelperBase{

    constructor(page: Page){
        super(page)
    }

    priceSliderMin = this.page.getByRole('slider').first()
    priceSliderMax = this.page.getByTestId('price-slider-max');

    scoreFilter = this.page.getByRole('checkbox').filter({hasText: "Very Good (7+)"})

    gridBtn = this.page.locator('button', { hasText: 'Grid' })
    //locator('[data-variant="transparent"][data-testid*="layout-select_trigger"]');
    //page.getByRole('button', { name: 'Grid' })
        //this.page.locator('button', { hasText: 'Grid' })
    //locator('.grid').locator('.ms-auto').locator('.rotate-90')
    //getByRole('button', { name: "Grid"})
    mapZoomIn = this.page.getByRole('option', {name:"Map"});
    hotelCards = this.page.getByRole('link', {name: "Go to hotel details"});

    async setPriceRange(min: number, max: number) {
        // await this.priceSliderMin.fill(min.toString());
        // await this.priceSliderMax.fill(max.toString());
        // await this.page.waitForTimeout(1000);

        //aria-valuenow

        const priceSlider = this.page.locator('[class="mt-2 m_dd36362e mantine-Slider-root"]').getByRole('slider')
        await priceSlider.evaluate(node => {
            node.setAttribute("aria-valuenow", min.toString())
            node.setAttribute("aria-valuenow", max.toString())
        })
        await priceSlider.click()
        // const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
        // await expect(tempBox).toContainText("30")
    }

    async applyPriceRangeFilter(min: number, max: number): Promise<void> {
        // Scroll até os filtros
        const priceRangeSection = this.page.locator('[class="mt-2 m_dd36362e mantine-Slider-root"]').getByRole('slider')
            //this.page.locator('text=Price Range').first();
        //await this.scrollToElement(priceRangeSection);

        // Ajustar sliders usando JavaScript
        await this.page.evaluate(({ minValue, maxValue }) => {
            const sliders = document.querySelectorAll('[role="slider"]');
            if (sliders.length >= 2) {
                const minSlider = sliders[0] as HTMLElement;
                const maxSlider = sliders[1] as HTMLElement;

                // Simular mudança de valor
                minSlider.setAttribute('aria-valuenow', minValue.toString());
                maxSlider.setAttribute('aria-valuenow', maxValue.toString());

                // Disparar eventos
                minSlider.dispatchEvent(new Event('input', { bubbles: true }));
                minSlider.dispatchEvent(new Event('change', { bubbles: true }));
                maxSlider.dispatchEvent(new Event('input', { bubbles: true }));
                maxSlider.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }, { minValue: min, maxValue: max });
    }

    async applyGuestScore() {
        await this.scoreFilter.check({force: true});
        await this.page.waitForTimeout(1000);
    }

    async selectMap(times = 2) {
        //for (let i = 0; i < times; i++) {
            await this.gridBtn.click();
            await this.mapZoomIn.click()

            await this.page.waitForTimeout(500);

        //}
    }

    async zoomInMap(times: number = 2) {
        const map = this.page.locator('.gm-style');
        await map.hover();
        await this.page.mouse.wheel(0, -1000); // negativo = zoom in

        await this.page.waitForTimeout(5000)
        console.log("zoom teste")
    }

    async selectAnyHotel() {
        await this.hotelCards.click();
        await this.page.waitForLoadState('networkidle');
    }
}
