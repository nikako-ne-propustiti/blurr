import { Builder, WebDriver, WebElement, until, By } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
import assert from 'assert';
import 'chromedriver';
import { writeFile } from 'fs/promises';

export function getDriver(): WebDriver {
    return new Builder()
        .forBrowser('chrome')
        .setChromeOptions(new Options().headless().windowSize({
            width: 1920,
            height: 1080
        }))
        .build();
}

export async function screenshot(driver: WebDriver, filename: string) {
    await writeFile(filename, await driver.takeScreenshot(), {
        encoding: 'base64'
    });
}

export async function waitForElement(driver: WebDriver, xpath: string): Promise<WebElement> {
    // Hopefully this fixes intermittent errors...
    let lastError;
    for (let i = 0; i < 10; ++i) {
        try {
            await driver.sleep(1000);
            const element = await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(xpath))), 100);
            return element;
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError;
}

export async function login(driver: WebDriver) {
    await driver.get('http://localhost:3000');
    await driver.wait(until.urlIs('http://localhost:3000/accounts/login'));
    const usernameBox = await driver.findElement(By.css('input[name="username"]'));
    const passwordBox = await driver.findElement(By.css('input[name="password"]'));
    const loginButton = await driver.findElement(By.css('input.button[type="submit"]'));
    await usernameBox.clear();
    await passwordBox.clear();
    await usernameBox.sendKeys('luka');
    await passwordBox.sendKeys('sifra');
    await loginButton.click();
    await driver.wait(until.urlIs('http://localhost:3000/'));
    const createButton = driver.findElement(By.css('a[title="Create"]'));
    await driver.wait(until.elementIsVisible(createButton))
    assert.equal(await createButton.getAttribute('title'), 'Create');
}

export async function register(driver: WebDriver) {
    await driver.get('http://localhost:3000/accounts/register');
    await driver.wait(until.urlIs('http://localhost:3000/accounts/register'));
    const usernameBox = await driver.findElement(By.css('input[name="username"]'));
    const realnameBox = await driver.findElement(By.css('input[name="name"]'));
    const passwordBox = await driver.findElement(By.css('input[name="password"]'));
    const repeatPasswordBox = await driver.findElement(By.css('input[name="repeat-password"]'));
    const registerButton = await driver.findElement(By.css('input.button[type="submit"]'));
    await usernameBox.sendKeys('testusername');
    await realnameBox.sendKeys('Test Ime');
    await passwordBox.sendKeys('sifra');
    await repeatPasswordBox.sendKeys('sifra');
    await registerButton.click();
    await driver.wait(until.urlIs('http://localhost:3000/'));    
    const createButton = driver.findElement(By.css('a[title="Create"]'));
    await driver.wait(until.elementIsVisible(createButton))
    assert.equal(await createButton.getAttribute('title'), 'Create');
}