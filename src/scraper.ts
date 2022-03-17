import puppeteer, { Browser, Page } from "puppeteer";

const LOGIN_URL = "https://myluxurycard.co.jp/";
const BASE_URL = "https://netstation2.aplus.co.jp/netstation/";
const DETAILS_URL = `${BASE_URL}MyFlowServlet?origin=GlobalNavi&event=detail_01`;

export class Scraper {
  browser: Browser | null = null;
  page: Page | null = null;

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      slowMo: 50,
    });
    this.page = await this.browser.newPage();
  }

  async login(username: string, password: string) {
    await this.page?.goto(LOGIN_URL, { waitUntil: "networkidle2" });
    await this.page?.waitForSelector('input[name="webMemberId"]');
    await this.page?.waitForTimeout(1000); // To make sure the form is loaded

    // Type input fields - User ID & Password
    await this.page?.type('input[name="webMemberId"]', username, {
      delay: 0,
    });
    await this.page?.type('input[name="webMemberPass"]', password, {
      delay: 0,
    });

    // Click on the login button
    const loginButton = await this.page?.$('button[type="submit"]');
    await loginButton?.click();
    await this.page?.waitForNavigation({ waitUntil: "networkidle2" });
  }

  async getPaymentDetailsProcess() {
    await this.page?.goto(DETAILS_URL, { waitUntil: "networkidle2" });
    await this.page?.waitForNavigation({ waitUntil: "networkidle2" });

    // TODO: Implement Scraping Table
  }

  async close() {
    await this.browser?.close();
  }
}
