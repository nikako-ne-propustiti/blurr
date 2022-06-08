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

it('follow user from post', async () => {
    await login(driver);
    await driver.get('http://localhost:3000/p/cloned10');
    await driver.wait(until.urlIs('http://localhost:3000/p/cloned10'));
    const followButton = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[1]/input');
    const followText = await followButton.getAttribute("value");
    assert.equal(followText, 'Follow');
    await followButton.click();
    await driver.sleep(1000);
    const unfollowButton = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[1]/input');
    const unfollowText = await unfollowButton.getAttribute("value");
    assert.equal(unfollowText, 'Unfollow');
});

it('unfollow user from post', async () => {
    const unfollowButton = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[1]/input');
    const unfollowText = await unfollowButton.getAttribute("value");
    assert.equal(unfollowText, 'Unfollow');
    await unfollowButton.click();
    await driver.sleep(1000);
    const followButton = await waitForElement(driver, '//*[@id="root"]/div/main/article/div/div/div[1]/input');
    const followText = await followButton.getAttribute("value");
    assert.equal(followText, 'Follow');
});

it('follow user from profile page', async () => {
    await driver.get('http://localhost:3000/postalot');
    await driver.wait(until.urlIs('http://localhost:3000/postalot'));
    const followButton = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[3]/input');
    const followText = await followButton.getAttribute("value");
    assert.equal(followText, 'Follow');
    const followersNumberElementBefore = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/ul/li[1]/b');
    const followersNumberBefore = await followersNumberElementBefore.getText();
    await followButton.click();
    await driver.sleep(1000);
    const unfollowButton = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[3]/input');
    const unfollowText = await unfollowButton.getAttribute("value");
    assert.equal(unfollowText, 'Unfollow');
    const followersNumberElementAfter = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/ul/li[1]/b');
    const followersNumberAfter = await followersNumberElementAfter.getText();
    assert.notEqual(followersNumberBefore, followersNumberAfter);    
});

it('unfollow user from profile page', async () => {
    const unfollowButton = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[3]/input');
    const unfollowText = await unfollowButton.getAttribute("value");
    assert.equal(unfollowText, 'Unfollow');
    const followersNumberElementBefore = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/ul/li[1]/b');
    const followersNumberBefore = await followersNumberElementBefore.getText();
    await unfollowButton.click();
    await driver.sleep(1000);
    const followButton = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[3]/input');
    const followText = await followButton.getAttribute("value");
    assert.equal(followText, 'Follow');
    const followersNumberElementAfter = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/ul/li[1]/b');
    const followersNumberAfter = await followersNumberElementAfter.getText();
    assert.notEqual(followersNumberBefore, followersNumberAfter);
});
