interface Currency {
  [key: string]: number;
}

interface Res {
  rates: Currency;
}

const currencyEl_one = document.getElementById('currency-one') as HTMLSelectElement;
const amountEl_one = document.getElementById('amount-one') as HTMLInputElement;
const currencyEl_two = document.getElementById('currency-two') as HTMLSelectElement;
const amountEl_two = document.getElementById('amount-two') as HTMLInputElement;
const rateEl = document.getElementById('rate') as HTMLElement;
const swap = document.getElementById('swap') as HTMLElement;

const getList = async (): Promise<Currency> => {
  try {
    const res = await fetch('https://open.exchangerate-api.com/v6/latest');
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const rates: Res = await res.json();
    return rates.rates;
  } catch (error) {
    console.error('Error fetching currency data:', error);
    return {};
  }
};

const optionList = async (): Promise<void> => {
  const list = await getList();
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
};

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
