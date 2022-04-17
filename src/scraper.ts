import puppeteer, { Browser, Page } from "puppeteer";
import * as fs from "fs";
import { stringify } from "csv-stringify/sync";
import { formatDate } from "./helper";

const LOGIN_URL = "https://myluxurycard.co.jp/";
const BASE_URL = "https://netstation2.aplus.co.jp/netstation/";
const DETAILS_URL = `${BASE_URL}MyFlowServlet?origin=GlobalNavi&event=detail_01`;

export class Scraper {
  browser: Browser | null = null;
  page: Page | null = null;
  data: Array<string>[] | undefined = [];
  date: string | undefined = "";

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: true,
      devtools: false,
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

  async goToPaymentDetailsPage() {
    await this.page?.goto(DETAILS_URL, { waitUntil: "networkidle2" });
  }

  async getDateProcess() {
    this.date = await this.page?.evaluate(() => {
      let date = document.querySelectorAll(".title-lv2")[1]?.innerHTML;
      console.log(date);
      return date;
    });
    this.date = await formatDate(this.date);
  }

  async getPaymentDetailsProcess() {
    this.data = await this.page?.evaluate(() => {
      const table = document.querySelector(".tbl-stripe-use-detail");
      const rows = table?.querySelectorAll("tr");
      return (
        rows &&
        Array.from(rows, (row) => {
          const columns = row.querySelectorAll("th, td");
          return Array.from(columns, (column) => column.innerHTML);
        })
      );
    });

    // Remove first recode as it's blank
    this.data?.shift();
    this.data = this.data
      ?.filter((i) => i[0] !== "&nbsp;")
      .map((i) => {
        i[0] =
          "20" +
          i[0].substring(0, 2) +
          "-" +
          i[0].substring(2, 4) +
          "-" +
          i[0].substring(4, 6);
        return i.slice(0, 3);
      });
  }

  async createCSV() {
    const csv = stringify(this.data as any);
    const path = `./dist/${this.date}.csv`;
    fs.writeFile(path, csv, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`${path} created.`);
      }
    });
  }

  async close() {
    await this.browser?.close();
  }
}
