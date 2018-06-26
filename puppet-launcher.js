const puppeteer = require('puppeteer')
console.log('ITS RUNNINGS!')
async function launchChrome() {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-dev-shm-usage',
        '--remote-debugging-port=9222',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ]
    })
    console.log('puppeteer.launch')
    const puppeteerProcess = browser.process()
    console.log(puppeteerProcess)
    browser.on('targetcreated', async (target) => {
      // Emitted when a target is created,
      // for example when a new page is opened by window.open or browser.newPage.
      console.log('browser.target.created')
      if (target.type() == "page") {
        let page = await target.page()
        page.on('request', (req) => {
          console.log('request')
        })
        page.on('response', async (resp) => {
          console.log('response')
        })
        page.on('framenavigated', async (frame) => {
          console.log('framenavigated')
          let url = frame.url()
          let performance = JSON.parse(
            await page.evaluate(() => JSON.stringify(window.performance.timing))
          )
          console.log('page.timings.domInteractive', (performance.domInteractive - performance.navigationStart))
          console.log('page.timings.load', (performance.loadEventStart - performance.navigationStart))
        })
      }

    })
    browser.on('targetchanged', async (target) => {
      // Emitted when the url of a target changes.
      console.log('browser.target.changed')
    })
    browser.on('targetdestroyed', async (target) => {
      // Emitted when a target is destroyed, for example when a page is closed.
      console.log('browser.target.destroyed')
      if (target.type() == "page") {
        page.removeListener('request')
        page.removeListener('response')
        page.removeListener('framenavigated')
      }
    })
    browser.on('disconnected', async () => {
      // Chromium is closed or crashed.
      // The browser.disconnect method was called
      console.log('browser.target.disconnected')
    })
  } catch (e) {
    console.log(e)
  }
}
launchChrome()
