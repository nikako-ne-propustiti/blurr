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

it('gets redirected to login when attempting to like a comment while logged out', async () => {
    await driver.get('http://localhost:3000/p/jezjezjez');
    const likeComment = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[2]/button/span');
    await likeComment.click();
    await driver.wait(until.urlIs('http://localhost:3000/accounts/login?returnTo=%2Fp%2Fjezjezjez'));
    const loginButton = await waitForElement(driver, '//input[@type="submit"][@class="button"]');
    assert.equal(await loginButton.getAttribute('value'), 'Login');
});

it('successfully likes a comment', async () => {
    await login(driver);
    await driver.get('http://localhost:3000/p/jezjezjez');
    let likeComment = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[2]/button/span');
    const heartBefore = await likeComment.getText();
    let numberOfLikesElement = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[2]/div/div[2]/span[2]');
    const numberOfLikesBefore = Number(((await numberOfLikesElement.getText()).split(' '))[0]);
    await likeComment.click();
    likeComment = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[2]/button/span');
    const heartAfter = await likeComment.getText();
    numberOfLikesElement = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[2]/div/div[2]/span[2]');
    const numberOfLikesAfter = Number(((await numberOfLikesElement.getText()).split(' '))[0]);
    assert.equal(numberOfLikesAfter - numberOfLikesBefore, 1);
    assert.notEqual(heartBefore, heartAfter);
});

it('successfully unlikes a comment', async () => {
    let likeComment = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[2]/button/span');
    const heartBefore = await likeComment.getText();
    let numberOfLikesElement = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[2]/div/div[2]/span[2]');
    const numberOfLikesBefore = Number(((await numberOfLikesElement.getText()).split(' '))[0]);
    await likeComment.click();
    likeComment = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[2]/button/span');
    const heartAfter = await likeComment.getText();
    numberOfLikesElement = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[2]/div/div[2]/span[2]');
    const numberOfLikesAfter = Number(((await numberOfLikesElement.getText()).split(' '))[0]);
    assert.equal(numberOfLikesBefore - numberOfLikesAfter, 1);
    assert.notEqual(heartBefore, heartAfter);
});
