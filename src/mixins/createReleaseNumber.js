const verMajor = 1;
const verMinor = 0;
const now = new Date();
const padTwo = (val) => (val > 9 ? "" : "0") + val;
const nowMonth = now.getMonth() + 1;
const nowDay = now.getDate();
const verBuildDate = now.getFullYear() + padTwo(nowMonth) + padTwo(nowDay);
const verBuildTime = padTwo(now.getHours()) + padTwo(now.getMinutes()) + padTwo(now.getSeconds());
export const ReleaseNumber = `${verMajor}.${verMinor}.${verBuildDate}.${verBuildTime}`;