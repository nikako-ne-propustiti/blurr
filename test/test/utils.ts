import {Builder, WebDriver, WebElementPromise, until, By} from 'selenium-webdriver';
import {Options} from 'selenium-webdriver/chrome';
import assert from 'assert';
import 'chromedriver';
import {writeFile} from 'fs/promises';

export function getDriver(): WebDriver {
    return new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new Options().headless().windowSize({
            width: 1920,
            height: 1080
        }))
        .build();
}

export async function screenshot(driver: WebDriver, filename: string) {
    await writeFile(filename, await driver.takeScreenshot(), {
        encoding: 'base64'
    });
}

export async function waitForElement(driver: WebDriver, xpath: string): Promise<WebElementPromise> {
    // Hopefully this fixes intermittent errors...
    await driver.sleep(3000);
    return driver.wait(until.elementIsVisible(driver.findElement(By.xpath(xpath))), 100);
}

export async function login(driver: WebDriver) {
    await driver.get('http://localhost:3000');
    await driver.wait(until.urlIs('http://localhost:3000/accounts/login'));
    const usernameBox = await driver.findElement(By.css('input[name="username"]'));
    const passwordBox = await driver.findElement(By.css('input[name="password"]'));
    const loginButton = await driver.findElement(By.css('input.button[type="submit"]'));
    await usernameBox.sendKeys('luka');
    await passwordBox.sendKeys('sifra');
    await loginButton.click();
    await driver.wait(until.urlIs('http://localhost:3000/'));
    const createButton = driver.findElement(By.css('a[title="Create"]'));
    await driver.wait(until.elementIsVisible(createButton))
    assert.equal(await createButton.getAttribute('title'), 'Create');
}
