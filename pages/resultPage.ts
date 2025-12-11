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

    gridBtn = this.page.locator('[class="mantine-focus-auto mantine-active rounded-lg px-[12px] py-[11px] text-[16px]/[22px] transition-colors bg-brand hover:bg-brand-fill-pressed active:bg-brand-fill-hover text-primary-button-label data-[variant=white]:bg-white data-[variant=white]:text-primary-text data-[variant=white]:hover:bg-neutral-fill-text-dividers-stroke-disabled data-[variant=white]:active:bg-neutral-fill-background-secondary data-[variant=outline]:border data-[variant=outline]:border-neutral-fill-text-dividers-stroke-disabled data-[variant=outline]:bg-white data-[variant=outline]:text-primary-text data-[variant=outline]:hover:bg-neutral-fill-text-dividers-stroke-disabled data-[variant=outline]:active:bg-neutral-fill-background-secondary data-[variant=transparent]:bg-transparent data-[variant=transparent]:text-primary-text data-[variant=transparent]:hover:bg-primary-text data-[variant=transparent]:hover:bg-opacity-5 data-[variant=transparent]:active:bg-primary-text data-[variant=transparent]:active:bg-opacity-10 data-[disabled]:pointer-events-none data-[disabled]:!bg-neutral-fill-text-dividers-stroke-disabled data-[disabled]:!text-neutral-text-icons-disabled min-w-0 m_77c9d27d mantine-Button-root m_87cf2631 mantine-UnstyledButton-root"]')

    mapZoomIn = this.page.getByRole('option', {name:"Map"});
    hotelCards = this.page.getByRole('link', {name: "Go to hotel details"});

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
        for (let i = 0; i < times; i++) {
            await this.gridBtn.click();
            await this.mapZoomIn.click()

            await this.page.waitForTimeout(500);

        }
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
