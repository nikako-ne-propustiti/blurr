import { WebDriver, until, By } from 'selenium-webdriver';
import assert from 'assert';
import 'chromedriver';
import { getDriver, waitForElement, screenshot, loginRegularUser, login } from './utils';

jest.setTimeout(60 * 1000);

let driver: WebDriver;

beforeAll(async () => {
    driver = await getDriver();
});

afterAll(async () => {
    await driver.quit();
});

it('guest visits feed and gets redirected to login page', async () => {
    await driver.get('http://localhost:3000');
    await driver.wait(until.urlIs('http://localhost:3000/accounts/login'));
    const loginButton = await waitForElement(driver, '//*[@id="root"]/div/main/form/input');
    assert.equal(await loginButton.getAttribute('value'), 'Login');
});

it('logged in user that is not following other users visits feed', async () => {
    await driver.get('http://localhost:3000');
    await driver.wait(until.urlIs('http://localhost:3000/accounts/login'));
    const usernameBox = await driver.findElement(By.css('input[name="username"]'));
    const passwordBox = await driver.findElement(By.css('input[name="password"]'));
    const loginButton = await driver.findElement(By.css('input.button[type="submit"]'));
    await usernameBox.clear();
    await passwordBox.clear();
    await usernameBox.sendKeys('postalot');
    await passwordBox.sendKeys('sifra');
    await loginButton.click();
    await driver.sleep(1000);
    await driver.wait(until.urlIs('http://localhost:3000/'));
    const suggestions = await waitForElement(driver, '//*[@id="root"]/div/main/div/h1');
    assert.equal(await suggestions.getText(), 'People you might know');
    const logoutButton = await waitForElement(driver, '//*[@id="root"]/div/div/nav/div[3]/a[4]/span');
    await logoutButton.click();
    await driver.sleep(1000);
});

it('logged in user that is following other users visits feed', async () => {
    await driver.get('http://localhost:3000');
    await driver.wait(until.urlIs('http://localhost:3000/accounts/login'));
    const usernameBox = await driver.findElement(By.css('input[name="username"]'));
    const passwordBox = await driver.findElement(By.css('input[name="password"]'));
    const loginButton = await driver.findElement(By.css('input.button[type="submit"]'));
    await usernameBox.clear();
    await passwordBox.clear();
    await usernameBox.sendKeys('feed');
    await passwordBox.sendKeys('sifra');
    await loginButton.click();
    await driver.sleep(1000);
    await driver.wait(until.urlIs('http://localhost:3000/'));
    await driver.sleep(10000);
    let postsArray = await driver.findElements(By.className('post-wrapper'));
    assert.equal(postsArray.length, 5);
    await driver.executeScript("window.scrollBy(0,1500)", "");
    await driver.sleep(100);
    await driver.executeScript("window.scrollBy(0,1500)", "");
    await driver.sleep(10000);
    postsArray = await driver.findElements(By.className('post-wrapper'));
    assert.equal(postsArray.length, 15);
});
