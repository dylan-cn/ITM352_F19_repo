/*

Create a function that takes an array of numbers, called monthly_sales (a list of monthly sales amounts), and a tax rate (tax_rate) as inputs. The function must return an array called tax_owing, which consists of one entry for every entry in monthly_sales indicating the tax owing for that entry.

*/

function taxOwedForMonthlySales(monthly_sales, tax_rate) {
    let tax_owing = monthly_sales.map(x => x * tax_rate);

    return tax_owing;
}

let monthly_sales = [10, 11, 12];
console.log(taxOwedForMonthlySales(monthly_sales, 0.1));