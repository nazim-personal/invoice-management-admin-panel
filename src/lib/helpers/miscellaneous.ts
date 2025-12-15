


export function formatWithThousands(
  value: number | string | undefined,
  keepDecimalsIfZero: boolean = false // default: remove .00
): string {
  if (value === undefined || value === null) return "";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);

  const isInteger = num % 1 === 0;

  return num.toLocaleString("en-IN", {
    minimumFractionDigits: isInteger
      ? (keepDecimalsIfZero ? 2 : 0)
      : 2,
    maximumFractionDigits: 2,
  });
}
