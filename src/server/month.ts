export function getCurrentMonthLabel(date = new Date()) {
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

export function getMonthRange(date = new Date()) {
  return {
    monthStart: new Date(date.getFullYear(), date.getMonth(), 1),
    monthEnd: new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
  };
}
