import {WebDriver, until, By} from 'selenium-webdriver';
import assert from 'assert';
import 'chromedriver';
import {getDriver, waitForElement, screenshot, login} from './utils';

jest.setTimeout(30 * 1000);

let driver: WebDriver;

beforeAll(async () => {
    driver = await getDriver();
});

afterAll(async () => {
    await driver.quit();
});

it('successfully logs in', async () => {
    await login(driver);
});
