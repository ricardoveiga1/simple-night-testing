import {test as base} from '@playwright/test';
import {PageManager} from "./pages/pageManager";

export type TestOptions = {
    baseQaURL: string
    baseStagingURL: string
    formLayoutsPage: string // fixture
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    baseQaURL: ['', { option: true }],

    formLayoutsPage: async({page}, use)=>{
      await page.goto('/')
      await page.getByText('Forms').click()
      await page.getByText('Form Layouts').click()
      await use('')
      console.log('Testanto fixture formLayoutsPage, é executado antes de tudo')
    }, //{ auto: true}],  // essa opção faz inicializar antes do do before e beforeEach, e fica disponível para qualquer teste, necessita de colchetes antes do async

  //iniciei formLayoutsPage dentro da PM
  // buildamos a pageManager como fixture
    pageManager: async({page, formLayoutsPage}, use) => {
      const pm = new PageManager(page)
      await use(pm)
    }

})
