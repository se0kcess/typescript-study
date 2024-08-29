"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');
const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');
const rateEl = document.getElementById('rate');
const swap = document.getElementById('swap');
const getList = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch('https://open.exchangerate-api.com/v6/latest');
    const rates = yield res.json();
    const list = rates.rates;
    return list;
});
const optionList = () => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield getList();
    for (let key in list) {
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        option1.value = key;
        option1.innerText = key;
        option1.setAttribute('data-rate', list[key].toString());
        option2.value = key;
        option2.innerText = key;
        option2.setAttribute('data-rate', list[key].toString());
        currencyEl_one.appendChild(option1);
        currencyEl_two.appendChild(option2);
        if (key === 'USD') {
            option1.selected = true;
        }
        if (key === 'KRW') {
            option2.selected = true;
        }
    }
    calculate();
});
optionList();
const calculate = () => {
    const currency_one = currencyEl_one.value;
    const currency_two = currencyEl_two.value;
    const rate_one = parseFloat(currencyEl_one.options[currencyEl_one.selectedIndex].getAttribute('data-rate') || '0');
    const rate_two = parseFloat(currencyEl_two.options[currencyEl_two.selectedIndex].getAttribute('data-rate') || '0');
    const rate = rate_two / rate_one;
    rateEl.innerText = `1 ${currency_one} = ${rate.toFixed(4)} ${currency_two}`;
    amountEl_two.value = (parseFloat(amountEl_one.value) * rate).toFixed(2);
};
currencyEl_one.addEventListener('change', calculate);
amountEl_one.addEventListener('input', calculate);
currencyEl_two.addEventListener('change', calculate);
amountEl_two.addEventListener('input', calculate);
swap.addEventListener('click', () => {
    const temp = currencyEl_one.value;
    currencyEl_one.value = currencyEl_two.value;
    currencyEl_two.value = temp;
    const tempAmount = amountEl_one.value;
    amountEl_one.value = amountEl_two.value;
    amountEl_two.value = tempAmount;
    calculate();
});
