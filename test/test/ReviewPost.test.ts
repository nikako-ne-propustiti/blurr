import {WebDriver, until, By} from 'selenium-webdriver';
import assert from 'assert';
import 'chromedriver';
import {getDriver, waitForElement, screenshot, loginRegularUser, login} from './utils';

jest.setTimeout(60 * 1000);

let driver: WebDriver;

beforeAll(async () => {
    driver = await getDriver();
});

afterAll(async () => {
    await driver.quit();
});

it('non-admin tries to review posts', async () => {
    await loginRegularUser(driver);
    await driver.get('http://localhost:3000/p/review');
    await driver.wait(until.urlIs('http://localhost:3000/'));
    const logoutButton = await driver.findElement(By.css('a[title="Logout"]'));
    await driver.wait(until.elementIsVisible(logoutButton))
    assert.equal(await logoutButton.getAttribute('title'), 'Logout');
    await logoutButton.click();
    await driver.wait(until.urlIs('http://localhost:3000/accounts/login'));
});

it('admin deletes post', async () => {
    await login(driver);
    const reviewButton = await waitForElement(driver, '//*[@id="root"]/div/div/nav/div[3]/a[4]/span');
    await reviewButton.click();
    await driver.wait(until.urlIs('http://localhost:3000/p/review'));
    await driver.sleep(10000);
    const acceptButton = await waitForElement(driver, '//*[@id="root"]/div/main/div/div[1]/div/button[1]');
    const firstPicture = await waitForElement(driver, '//*[@id="root"]/div/main/div/div[1]/article/div/img');
    const firstPictureSrc = await firstPicture.getAttribute("src");
    await acceptButton.click();
    const secondPicture = await waitForElement(driver, '//*[@id="root"]/div/main/div/div[1]/article/div/img');
    const secondPictureSrc = await secondPicture.getAttribute("src");
    assert.notEqual(firstPictureSrc, secondPictureSrc);
});

it('admin approves post', async () => {
    const acceptButton = await waitForElement(driver, '//*[@id="root"]/div/main/div/div[1]/div/button[2]');
    const firstPicture = await waitForElement(driver, '//*[@id="root"]/div/main/div/div[1]/article/div/img');
    const firstPictureSrc = await firstPicture.getAttribute("src");
    await acceptButton.click();
    const secondPicture = await waitForElement(driver, '//*[@id="root"]/div/main/div/div[1]/article/div/img');
    const secondPictureSrc = await secondPicture.getAttribute("src");
    assert.notEqual(firstPictureSrc, secondPictureSrc);
});
