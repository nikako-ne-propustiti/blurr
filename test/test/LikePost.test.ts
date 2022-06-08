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

it('gets redirected to login when attempting to like a post while logged out', async () => {
    await driver.get('http://localhost:3000/p/jezjezjez');
    const likePost = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[1]/button/span');
    await likePost.click();
    await driver.wait(until.urlIs('http://localhost:3000/accounts/login?returnTo=%2Fp%2Fjezjezjez'));
    const loginButton = await waitForElement(driver, '//input[@type="submit"][@class="button"]');
    assert.equal(await loginButton.getAttribute('value'), 'Login');
});

it('successfully unlikes a post', async () => {
    await login(driver);
    await driver.get('http://localhost:3000/p/jezjezjez');
    let likePost = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[1]/button/span');
    const heartBefore = await likePost.getText();
    let numberOfLikesElement = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[1]/div/div[2]/span[2]');
    const numberOfLikesBefore = Number(((await numberOfLikesElement.getText()).split(' '))[0]);
    await likePost.click();
    likePost = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[1]/button/span');
    const heartAfter = await likePost.getText();
    numberOfLikesElement = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[1]/div/div[2]/span[2]');
    const numberOfLikesAfter = Number(((await numberOfLikesElement.getText()).split(' '))[0]);
    assert.equal(numberOfLikesBefore - numberOfLikesAfter, 1);
    assert.notEqual(heartBefore, heartAfter);
});

it('successfully likes a post', async () => {
    let likePost = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[1]/button/span');
    const heartBefore = await likePost.getText();
    let numberOfLikesElement = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[1]/div/div[2]/span[2]');
    const numberOfLikesBefore = Number(((await numberOfLikesElement.getText()).split(' '))[0]);
    await likePost.click();
    likePost = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[1]/button/span');
    const heartAfter = await likePost.getText();
    numberOfLikesElement = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[2]/ul/li[1]/div/div[2]/span[2]');
    const numberOfLikesAfter = Number(((await numberOfLikesElement.getText()).split(' '))[0]);
    assert.equal(numberOfLikesAfter - numberOfLikesBefore, 1);
    assert.notEqual(heartBefore, heartAfter);
});
