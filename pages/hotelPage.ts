
import { Page } from '@playwright/test';

export class HotelPage {
    constructor(private page: Page) {}

    price = this.page.getByTestId('hotel-price');
    score = this.page.getByTestId('hotel-score');

    async getPrice(): Promise<number> {
        const text = await this.price.textContent();
        return Number(text?.replace(/[^0-9]/g, ''));
    }

    async getScore(): Promise<number> {
        const text = await this.score.textContent();
        return Number(text);
    }
}

