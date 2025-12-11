import { Page } from "@playwright/test";
import {HomePage} from "./homePage";
import {HotelPage} from "./hotelPage";
import {ResultsPage} from "./resultPage";



export class PageManager {

    private readonly page: Page
    private readonly homePage: HomePage
    private readonly hotelPage: HotelPage
    private readonly resultPage: ResultsPage

    constructor(page: Page){
        this.page = page
        this.homePage = new HomePage(this.page)
        this.hotelPage = new HotelPage(this.page)
        this.resultPage = new ResultsPage(this.page)
    }

    navigateTo(){
        return this.homePage
    }
    onHotelPage(){
        return this.hotelPage
    }
    onResultPage(){
        return this.resultPage
    }
}