import {Builder, WebDriver, until, By} from 'selenium-webdriver';
import {Options} from 'selenium-webdriver/chrome';
import assert from 'assert';
import 'chromedriver';
import {writeFile} from 'fs/promises';
import {resolve} from 'path';

jest.retryTimes(3);
jest.setTimeout(30 * 1000);

let driver: WebDriver;

beforeAll(async () => {
    driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new Options().headless().windowSize({
            width: 1920,
            height: 1080
        }))
        .build();
});

afterAll(async () => {
    await driver.quit();
});

async function screenshot(filename: string) {
    await writeFile(filename, await driver.takeScreenshot(), {
        encoding: 'base64'
    });
}

it('successfully logs in', async () => {
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
});

it('successfully creates a post', async () => {
    await driver.get('http://localhost:3000');
    await driver.wait(until.urlIs('http://localhost:3000/'));
    const createButton = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//a[contains(@href, "/p/new")]'))));
    assert.equal(await createButton.getAttribute('title'), 'Create');
    await createButton.click();
    const uploadBox = driver.findElement(By.css('input[type="file"]'));
    await driver.sleep(3000);
    await driver.wait(until.elementIsVisible(driver.findElement(By.className('create-post-image-info'))));
    await uploadBox.sendKeys(resolve('../backend/test/fixtures/files/post.jpg'));
    const passwordBox = await driver.findElement(By.className('create-post-password'));
    const submitButton = await driver.findElement(By.xpath('//input[@type="submit"]'));
    await passwordBox.sendKeys('123');
    await submitButton.click();
});
