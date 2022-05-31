import {WebDriver, until, By} from 'selenium-webdriver';
import assert from 'assert';
import 'chromedriver';
import {resolve} from 'path';
import {getDriver, waitForElement, screenshot, login} from './utils';

jest.setTimeout(30 * 1000);

let driver: WebDriver;

beforeAll(async () => {
    driver = await getDriver();
});

afterAll(async () => {
    await driver.quit();
});

it('gets redirected to login when attempting to create a post while logged out', async () => {
    await driver.get('http://localhost:3000/p/new');
    const loginButton = await waitForElement(driver, '//input[@type="submit"][@class="button"]');
    assert.equal(await loginButton.getAttribute('value'), 'Login');
});

it('successfully creates a post', async () => {
    await login(driver);
    await driver.get('http://localhost:3000');
    await driver.wait(until.urlIs('http://localhost:3000/'));
    const createButton = await waitForElement(driver, '//a[contains(@href, "/p/new")]');
    assert.equal(await createButton.getAttribute('title'), 'Create');
    await createButton.click();
    const uploadBox = driver.findElement(By.css('input[type="file"]'));
    await waitForElement(driver, '//fieldset[@class="create-post-image-info"]');
    await uploadBox.sendKeys(resolve('../backend/test/fixtures/files/post.jpg'));
    const passwordBox = await driver.findElement(By.className('create-post-password'));
    const submitButton = await driver.findElement(By.xpath('//input[@type="submit"]'));
    assert(!await submitButton.isEnabled());
    await passwordBox.sendKeys('123');
    assert(await submitButton.isEnabled());
    await submitButton.click();
    const postHeaderLink = await waitForElement(driver, '//div[@class="profile-bar"]/a[2]');
    assert.equal(await postHeaderLink.getText(), 'luka');
    const postFooterDelete = await waitForElement(driver, '//div[@class="post-bottom"]/button/span');
    assert.equal(await postFooterDelete.getText(), 'delete');
});
