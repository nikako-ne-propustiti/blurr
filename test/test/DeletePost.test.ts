import { WebDriver, until, By } from 'selenium-webdriver';
import assert from 'assert';
import 'chromedriver';
import { resolve } from 'path';
import { getDriver, waitForElement, screenshot, login } from './utils';

jest.setTimeout(30 * 1000);

let driver: WebDriver;

beforeAll(async () => {
    driver = await getDriver();
});

afterAll(async () => {
    await driver.quit();
});

it('user successfully deletes his post', async () => {
    await driver.get('http://localhost:3000');
    await driver.wait(until.urlIs('http://localhost:3000/accounts/login'));
    const usernameBox = await driver.findElement(By.css('input[name="username"]'));
    const passwordBox = await driver.findElement(By.css('input[name="password"]'));
    const loginButton = await driver.findElement(By.css('input.button[type="submit"]'));
    await usernameBox.clear();
    await passwordBox.clear();
    await usernameBox.sendKeys('aleksa');
    await passwordBox.sendKeys('sifra');
    await loginButton.click();
    await driver.wait(until.urlIs('http://localhost:3000/'));
    await driver.get('http://localhost:3000/p/moremoremore');
    await driver.wait(until.urlIs('http://localhost:3000/p/moremoremore'));
    await driver.sleep(500);
    const deleteButton = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[3]/button');
    await deleteButton.click();
    await driver.sleep(3000);
    await driver.get('http://localhost:3000/p/moremoremore');
    await driver.wait(until.urlIs('http://localhost:3000/p/moremoremore'));
    await driver.sleep(1000);
    const errorMessage = await waitForElement(driver, '//*[@id="root"]/div/main/p');
    assert.equal(await errorMessage.getText(), 'Requested post does not exist.');
});
