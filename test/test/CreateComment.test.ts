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

it('gets redirected to login when attempting to create a comment while logged out', async () => {
    await driver.get('http://localhost:3000/p/jezjezjez');
    const commentBox = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/form[1]/input[1]');
    const commentButton = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/form[1]/input[2]');
    await commentBox.sendKeys('test');
    await commentButton.click();
    await driver.wait(until.urlIs('http://localhost:3000/accounts/login?returnTo=%2Fp%2Fjezjezjez'));
    const loginButton = await waitForElement(driver, '//input[@type="submit"][@class="button"]');
    assert.equal(await loginButton.getAttribute('value'), 'Login');
});

it('unable to comment when comment is empty', async () => {
    await login(driver);
    await driver.get('http://localhost:3000/p/jezjezjez');
    const commentButton = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/form[1]/input[2]');
    assert(!(await commentButton.isEnabled()));
});

it('successfully created a comment', async () => {
    const commentBox = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/form[1]/input[1]');
    const commentButton = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/form[1]/input[2]');
    await commentBox.sendKeys('test');
    await commentButton.click();
    const testComment = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[5]/div/div[1]');
    assert.equal(await testComment.getText(), 'lukatest');
});
