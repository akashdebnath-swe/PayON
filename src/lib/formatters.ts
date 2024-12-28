const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
    minimumFractionDigits: 0,
});

// For Indian Currency
// const CURRENCY_FORMATTER = new Intl.NumberFormat("hi-IN", {
//     currency: "INR",
//     style: "currency",
//     minimumFractionDigits: 0,
// });

export function formatCurrency(amount: number) {
    return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US");

export function formatNumber(number: number) {
    return NUMBER_FORMATTER.format(number);
}
