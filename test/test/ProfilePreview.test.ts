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

it('profile does not exist', async () => {
    await driver.get('http://localhost:3000/userdoesntexist');
    await driver.wait(until.urlIs('http://localhost:3000/userdoesntexist'));
    const errorMessageElement = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div/p');
    const errorMessage = await errorMessageElement.getText();
    assert.equal(errorMessage, 'The requested user does not exist.');

});

it('guest visits existing profile', async () => {
    await driver.get('http://localhost:3000/pavled');
    await driver.wait(until.urlIs('http://localhost:3000/pavled'));
    const name = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/h1');
    const followers = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/ul/li[1]');
    const following = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/ul/li[2]');
    const posts = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/ul/li[3]');
    const pfp = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[1]/img');
    const followButtons = await driver.findElements(By.xpath('//*[@id="root"]/div/main/section[1]/div[3]/input'));
    assert.equal(await name.getText(), 'pavled - Pavle Divović');
    assert.equal(await followers.getText(), '2 followers');
    assert.equal(await following.getText(), '2 following');
    assert.equal(await posts.getText(), '0 posts');
    assert.equal(await pfp.getAttribute('src'), 'http://localhost:3001//default-images/default_user.jpg');
    assert.equal(await followButtons.length, 0);
});

it('logged in user visits existing profile', async () => {
    await driver.get('http://localhost:3000');
    await driver.wait(until.urlIs('http://localhost:3000/accounts/login'));
    const usernameBox = await driver.findElement(By.css('input[name="username"]'));
    const passwordBox = await driver.findElement(By.css('input[name="password"]'));
    const loginButton = await driver.findElement(By.css('input.button[type="submit"]'));
    await usernameBox.clear();
    await passwordBox.clear();
    await usernameBox.sendKeys('aleksa');
    await passwordBox.sendKeys('sifra');
    await loginButton.click();
    await driver.sleep(1000);
    await driver.wait(until.urlIs('http://localhost:3000/'));
    await driver.get('http://localhost:3000/pavled');
    await driver.wait(until.urlIs('http://localhost:3000/pavled'));
    const name = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/h1');
    const followers = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/ul/li[1]');
    const following = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/ul/li[2]');
    const posts = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/ul/li[3]');
    const pfp = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[1]/img');
    const followButtons = await driver.findElements(By.xpath('//*[@id="root"]/div/main/section[1]/div[3]/input'));
    assert.equal(await name.getText(), 'pavled - Pavle Divović');
    assert.equal(await followers.getText(), '2 followers');
    assert.equal(await following.getText(), '2 following');
    assert.equal(await posts.getText(), '0 posts');
    assert.equal(await pfp.getAttribute('src'), 'http://localhost:3001//default-images/default_user.jpg');
    assert.equal(await followButtons.length, 1);
});

it('logged in user visits his profile', async () => {
    await driver.get('http://localhost:3000/aleksa');
    await driver.wait(until.urlIs('http://localhost:3000/aleksa'));
    const name = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/h1');
    const followers = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/ul/li[1]');
    const following = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/ul/li[2]');
    const posts = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[2]/ul/li[3]');
    const pfp = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[1]/img');
    const editProfileButton = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[3]/a');
    assert.equal(await name.getText(), 'aleksa - Aleksa Marković');
    assert.equal(await followers.getText(), '6 followers');
    assert.equal(await following.getText(), '2 following');
    assert.equal(await pfp.getAttribute('src'), 'http://localhost:3001//default-images/default_user.jpg');
    assert.equal(await editProfileButton.getText(), 'Edit account');
});

it('logged in clicks edit account button', async () => {
    const editProfileButton = await waitForElement(driver, '//*[@id="root"]/div/main/section[1]/div[3]/a');
    await editProfileButton.click();
    driver.sleep(1000);
    await driver.wait(until.urlIs('http://localhost:3000/accounts/edit'));
    const editAccount = await waitForElement(driver, '//*[@id="root"]/div/main/div/h1');
    assert.equal(await editAccount.getText(), 'Edit account');
});
