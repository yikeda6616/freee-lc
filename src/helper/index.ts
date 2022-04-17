const dayjs = require("dayjs"); // v1.9.7
dayjs.extend(require("dayjs/plugin/timezone"));
dayjs.extend(require("dayjs/plugin/utc"));

const formatDate = (str: string | undefined): string => {
  if (!str) {
    return "error: str is undifined";
  }

  const trimmedStr = str.slice(0, str.indexOf("　"));
  const regex = /年|月/gi;
  const dateStr = trimmedStr
    .replaceAll(regex, "-")
    .slice(0, trimmedStr.indexOf("日"));

  const formattedDate = dayjs.tz(dateStr, "Asia/Tokyo").format("YYYY-MM-DD");
  return formattedDate;
};

export { formatDate };
