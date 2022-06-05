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

it('unsuccessful login params missing', async () => {
    await driver.get('http://localhost:3000');
    await driver.wait(until.urlIs('http://localhost:3000/accounts/login'));
    const usernameBox = await driver.findElement(By.css('input[name="username"]'));
    const passwordBox = await driver.findElement(By.css('input[name="password"]'));
    const loginButton = await driver.findElement(By.css('input.button[type="submit"]'));
    await passwordBox.sendKeys('sifra');
    await loginButton.click();
    const errorMessage = await waitForElement(driver, '//*[@id="root"]/div/main/form/p[3]');
    assert.equal(await errorMessage.getText(), 'Missing required fields.');
    await passwordBox.clear();
    await usernameBox.sendKeys('luka');
    assert.equal(await errorMessage.getText(), 'Missing required fields.');
});

it('unsuccessful login non-existing username', async () => {
    const usernameBox = await driver.findElement(By.css('input[name="username"]'));
    const passwordBox = await driver.findElement(By.css('input[name="password"]'));
    const loginButton = await driver.findElement(By.css('input.button[type="submit"]'));
    await usernameBox.clear();
    await passwordBox.clear();
    await usernameBox.sendKeys('nepostojecekorisnickoime');
    await passwordBox.sendKeys('sifra');
    await loginButton.click();
    const errorMessage = await waitForElement(driver, '//*[@id="root"]/div/main/form/p[3]');
    assert.equal(await errorMessage.getText(), 'Invalid username or password.');
});

it('unsuccessful login wrong password', async () => {
    const usernameBox = await driver.findElement(By.css('input[name="username"]'));
    const passwordBox = await driver.findElement(By.css('input[name="password"]'));
    const loginButton = await driver.findElement(By.css('input.button[type="submit"]'));
    await usernameBox.clear();
    await passwordBox.clear();
    await usernameBox.sendKeys('luka');
    await passwordBox.sendKeys('pogresnasifra');
    await loginButton.click();
    const errorMessage = await waitForElement(driver, '//*[@id="root"]/div/main/form/p[3]');
    assert.equal(await errorMessage.getText(), 'Invalid username or password.');
});

it('successfully logs in', async () => {
    await login(driver);
});

it('user already logged in', async () => {
    await driver.get('http://localhost:3000/accounts/login');
    await driver.wait(until.urlIs('http://localhost:3000/'));
    const createButton = driver.findElement(By.css('a[title="Create"]'));
    await driver.wait(until.elementIsVisible(createButton))
    assert.equal(await createButton.getAttribute('title'), 'Create');
});