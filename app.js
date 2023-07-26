const {firefox} = require('playwright');

const _email = ''; // enter email address - ввести адресу
const _password = ''; // enter password - ввести пароль

(async () => {
  const browser = await firefox.launch({headless: false, slowMo: 50});
  const page = await browser.newPage();
  await page.goto(`https://mail.google.com/mail/`);
  console.log(`Start`);
  await page.waitForSelector('#identifierId'); // waiting for an INPUT to enter an EMAIL

  //--------------------------------------------------------------------------------------------------------------------
  // block -  choose a LANGUAGE - блок вибираємо мову
  await page.locator('div[role="combobox"]').click();
  await page.locator('ul > li').filter({hasText: 'Українська'}).click(); // choose a language

  //--------------------------------------------------------------------------------------------------------------------
  // block - EMAIL address input - блок введення емейл адреса
  await page.waitForSelector('#identifierId'); // waiting for an input to enter an email
  await page
    .evaluate(
      (val) => (document.querySelector('#identifierId').value = val),
      _email
    ) // enter into the value of the input
    .then(async function () {
      await page.locator('#identifierNext > div > button').click(); // click Next
    })
    .catch(function (err) {
      console.log(
        'Attention!!! Something is not right in the email input block !!!'
      );
      console.log(err);
    });
  console.log(`email address input block - done`);

  //--------------------------------------------------------------------------------------------------------------------
  //block - PASSWORD input - блок введення password адреса
  await page.waitForSelector('#password input[type="password"]');
  await page
    .evaluate(
      (val) =>
        (document.querySelector('#password input[type="password"]').value =
          val),
      _password
    ) // enter into the value of the input
    .then(async function () {
      await page.locator('#passwordNext > div > button').click(); // click Next
    })
    .catch(function (err) {
      console.log(
        'Attention!!! Something is not right in the password input block !!!'
      );
      console.log(err);
    });
  console.log(`password input block - done`);

  //--------------------------------------------------------------------------------------------------------------------
  // block - choose SETTINGS for change language - блок відкриття налаштувань
  await page.waitForSelector(
    `//html/body/div[7]/div[3]/div/div[1]/div[3]/header/div[2]/div[2]/div[3]/div/a`,
    {timeout: 60000}
  );
  await page
    .locator(
      `xpath=//html/body/div[7]/div[3]/div/div[1]/div[3]/header/div[2]/div[2]/div[3]/div/a`
    )
    .click(); //find the button SETTINGS and click it

  await page.waitForTimeout(10000);
  console.log(
    `Timeout 10s - if you have high speed internet, you can change the timeout setting, str(70)`
  );
  await page.waitForSelector(
    `//html/body/div[7]/div[3]/div/div[2]/div[3]/div[1]/div[1]/div[1]/div/button[2]`,
    {timeout: 60000}
  );
  await page
    .locator(
      `xpath=//html/body/div[7]/div[3]/div/div[2]/div[3]/div[1]/div[1]/div[1]/div/button[2]`
    )
    .click(); //find the button SEE ALL SETTINGS and click it
  await page.waitForTimeout(30000);
  console.log(
    `Timeout 30s - if you have high speed internet, you can change the timeout setting, str(83)`
  );
  let allSelect = await page.evaluate((li) => {
    return [...document.querySelectorAll(li)].map((anchor) => {
      return {
        id: anchor.id,
      };
    }); // find an array of ALL SELECT
  }, `select`);
  const handle = await page.locator(`xpath=//*[@id="${allSelect[0].id}"]`);
  await handle.click(); //find the SELECT and click it
  await page.waitForTimeout(10000);
  console.log(
    `Timeout 10s - if you have high speed internet, you can change the timeout setting, str(96)`
  );
  await handle.selectOption({value: 'uk'}); // select language

  const buttonDisable = await page.evaluate((li) => {
    return document.querySelector(li).getAttribute('disabled');
  }, `button[guidedhelpid="save_changes_button"]`); //check if the save button is enabled
  if (buttonDisable === null) {
    await page.locator(`button[guidedhelpid="save_changes_button"]`).click(); //find the button and click it
  } else {
    await page
      .locator(
        `tr[guidedhelpid="save_changes_row"] > td > div >  button:nth-child(2)`
      )
      .click(); //find the button and click it
  }
  console.log(`choose settings for language - done`);

  //--------------------------------------------------------------------------------------------------------------------
  //block - MORE button search block in the left menu - блок пошуку кнопки більше у лівому меню
  await page.waitForTimeout(10000);
  console.log(
    `Timeout 10s - if you have high speed internet, you can change the timeout setting, str(118)`
  );
  let allSpanButton = await page.evaluate((li) => {
    return [...document.querySelectorAll(li)].map((anchor) => {
      return {
        id: anchor.id + '',
        html: anchor.innerHTML,
      };
    });
  }, `span[role="button"]`); // create an array of all buttons
  for (let i = 0; i < allSpanButton.length; i++) {
    if (allSpanButton[i].html.includes('Більше')) {
      await page.locator(`xpath=//*[@id="${allSpanButton[i].id}"]`).click(); //find the button and click it
      break;
    }
  }
  console.log(`more button search block - done`);

  //--------------------------------------------------------------------------------------------------------------------
  // block - search button ALL LETTERS - блок пошуку кнопки усі листи
  await page.waitForSelector(`span > a[target="_top"]`);
  let allA = await page.evaluate((li) => {
    return [...document.querySelectorAll(li)].map((anchor) => {
      return {
        href: anchor.href,
      };
    });
  }, `span > a[target="_top"]`); // find an array of links
  for (let i = 0; i < allA.length; i++) {
    if (allA[i].href.includes('#all')) {
      await page.locator(`a[href="${allA[i].href}"]`).click(); //find the href and click it
      break;
    }
  }
  console.log(`block search button all letters - done`);

  //--------------------------------------------------------------------------------------------------------------------
  await page.waitForTimeout(5000);
  console.log(
    `Timeout 5s - if you have high speed internet, you can change the timeout setting, str(157)`
  );
  await page
    .locator('div[role="button"]')
    .filter({
      hasText: 'Непрочитаний',
    })
    .click(); //find the href and click it
  console.log(`block search for unread button - done`);

  //--------------------------------------------------------------------------------------------------------------------
  // block - COUNTING unread messages - блок підрахунку не прочитаних листів
  async function clickButtonMore() {
    await page.waitForTimeout(2000);
    let dataTooltip = await page.evaluate((li) => {
      return [...document.querySelectorAll(li)].map((anchor) => {
        return {
          html: anchor.innerHTML,
          id: anchor.id,
          disabled: anchor.getAttribute('aria-disabled'),
        };
      });
    }, `div[data-tooltip="Старіші"]`); // find arr buttons and check 'aria-disabled'
    if (dataTooltip[dataTooltip.length - 1].disabled === null) {
      await page
        .locator(`xpath=//*[@id="${dataTooltip[dataTooltip.length - 1].id}"]`)
        .click(); //find the button MORE and click it
      await page.waitForTimeout(5000);
      console.log(
        `Timeout 5s - if you have high speed internet, you can change the timeout setting, str(186)`
      );
      return await clickButtonMore();
    } else {
      let res = await page.evaluate((li) => {
        return [...document.querySelectorAll(li)].map((anchor) => {
          return {
            id: anchor.id,
            text: anchor.textContent,
          };
        });
      }, `span > div[aria-label="Показати більше повідомлень"]`);
      console.log(
        `Number of unread messages - ${
          res[res.length - 1].text.split(' з ')[1]
        }`
      );
    }
  }
  await clickButtonMore();

  await page.waitForTimeout(2000);
  //--------------------------------------------------------------------------------------------------------------------
  await browser.close();
})();
