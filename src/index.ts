import * as dotenv from "dotenv";
import { Scraper } from "./scraper";

const env: dotenv.DotenvParseOutput = dotenv.config().parsed ?? {};

(async () => {
  const lc = new Scraper();

  await lc.initialize();

  await lc.login(env.USERNAME, env.PASSWORD);

  await lc.getPaymentDetailsProcess();

  await lc.close();
})();
