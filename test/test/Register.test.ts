import {WebDriver, until, By} from 'selenium-webdriver';
import assert from 'assert';
import 'chromedriver';
import {getDriver, waitForElement, screenshot, login, register} from './utils';

jest.setTimeout(30 * 1000);

let driver: WebDriver;

beforeAll(async () => {
    driver = await getDriver();
});

afterAll(async () => {
    await driver.quit();
});

it('unsuccessful registration params missing', async () => {
    await driver.get('http://localhost:3000/accounts/register');
    await driver.wait(until.urlIs('http://localhost:3000/accounts/register'));
    const usernameBox = await driver.findElement(By.css('input[name="username"]'));
    const realnameBox = await driver.findElement(By.css('input[name="name"]'));
    const passwordBox = await driver.findElement(By.css('input[name="password"]'));
    const repeatPasswordBox = await driver.findElement(By.css('input[name="repeat-password"]'));
    const registerButton = await driver.findElement(By.css('input.button[type="submit"]'));
    // username missing
    await realnameBox.sendKeys('Test Ime');
    await passwordBox.sendKeys('sifra');
    await repeatPasswordBox.sendKeys('sifra');
    await registerButton.click();
    const errorMessage = await waitForElement(driver, '//*[@id="root"]/div/main/form/p[5]');
    assert.equal(await errorMessage.getText(), 'Please fill in all the fields.');
    // realname missing
    await usernameBox.sendKeys('testusername');
    await realnameBox.clear();
    await registerButton.click();
    assert.equal(await errorMessage.getText(), 'Please fill in all the fields.');
    // password missing
    await realnameBox.sendKeys('Test Ime');
    await passwordBox.clear();
    await registerButton.click();
    assert.equal(await errorMessage.getText(), 'Please fill in all the fields.');
    // repeated password missing
    await passwordBox.sendKeys('sifra');
    await repeatPasswordBox.clear();
    await registerButton.click();
    assert.equal(await errorMessage.getText(), 'Passwords do not match.');

});

it('unsuccessful registration username already exists', async () => {
    const usernameBox = await driver.findElement(By.css('input[name="username"]'));
    const realnameBox = await driver.findElement(By.css('input[name="name"]'));
    const passwordBox = await driver.findElement(By.css('input[name="password"]'));
    const repeatPasswordBox = await driver.findElement(By.css('input[name="repeat-password"]'));
    const registerButton = await driver.findElement(By.css('input.button[type="submit"]'));
    await usernameBox.clear();
    await passwordBox.clear();
    await realnameBox.clear();
    await repeatPasswordBox.clear();
    await usernameBox.sendKeys('luka');
    await realnameBox.sendKeys('Test Ime');
    await passwordBox.sendKeys('sifra');
    await repeatPasswordBox.sendKeys('sifra');
    await registerButton.click();
    const errorMessage = await waitForElement(driver, '//*[@id="root"]/div/main/form/p[5]');
    assert.equal(await errorMessage.getText(), 'Already exists.');
});

it('unsuccessful registration wrong repeated password', async () => {
    const usernameBox = await driver.findElement(By.css('input[name="username"]'));
    const realnameBox = await driver.findElement(By.css('input[name="name"]'));
    const passwordBox = await driver.findElement(By.css('input[name="password"]'));
    const repeatPasswordBox = await driver.findElement(By.css('input[name="repeat-password"]'));
    const registerButton = await driver.findElement(By.css('input.button[type="submit"]'));
    await usernameBox.clear();
    await passwordBox.clear();
    await realnameBox.clear();
    await repeatPasswordBox.clear();
    await usernameBox.sendKeys('luka');
    await realnameBox.sendKeys('Test Ime');
    await passwordBox.sendKeys('sifra');
    await repeatPasswordBox.sendKeys('sifra1');
    await registerButton.click();
    const errorMessage = await waitForElement(driver, '//*[@id="root"]/div/main/form/p[5]');
    assert.equal(await errorMessage.getText(), 'Passwords do not match.');
});

it('successfully registers', async () => {
    await register(driver);
});
