import {Locator, Page} from "@playwright/test";


export class HelperBase {

    readonly page: Page

    constructor(page: Page){
        this.page = page
    }

    async waitNumberOfSeconds(timeInSeconds: number){
        await this.page.waitForTimeout(timeInSeconds * 1000)
    }

    async scrollToElement(locator: Locator) {
        await locator.scrollIntoViewIfNeeded();
    }
}