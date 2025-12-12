import { Page } from "@playwright/test";
import {HomePage} from "./homePage";
import {HotelPage} from "./hotelPage";
import {MapViewPage} from "./mapViewPage";

export class PageManager {

    private readonly page: Page
    private readonly homePage: HomePage
    private readonly hotelPage: HotelPage
    private readonly mapViewPage: MapViewPage

    constructor(page: Page){
        this.page = page
        this.homePage = new HomePage(this.page)
        this.hotelPage = new HotelPage(this.page)
        this.mapViewPage = new MapViewPage(this.page)
    }

    onHomePage(){
        return this.homePage
    }
    onHotelPage(){
        return this.hotelPage
    }
    onMapViewPage(){
        return this.mapViewPage
    }

}