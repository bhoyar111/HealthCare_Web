// import { createContext, useContext, useState } from "react";
import { DateTime } from "luxon";

export const convertToTimezone = (date, timezone) => {
  return DateTime.fromISO(date)
    .setZone(timezone)
    .toLocaleString(DateTime.DATETIME_MED);
};

