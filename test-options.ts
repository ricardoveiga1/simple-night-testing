import {test as base} from '@playwright/test';
import {PageManager} from "./pages/pageManager";


export type TestOptions = {
    goHomePage: string
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({

    goHomePage: async({page}, use)=>{
      await page.goto('/')
        await use('')
      console.log('go to homepage to booking hotel')
    },

    pageManager: async({page}, use) => {
      const pm = new PageManager(page)
      await use(pm)
    }
})
