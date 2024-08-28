const $form = document.querySelector('form') as HTMLFormElement;
const $myText = document.querySelector('#myText') as HTMLInputElement;
const $textList = document.querySelector('.textList') as HTMLUListElement;
const Storage_KEY = 'saveTexts';

const addTextList = (text: string): void => {
  const li = document.createElement('li');
  li.innerHTML = `<span class="text">${text}</span>`;
  $textList.prepend(li);
};
const saveToLocalStorage = (text: string): void => {
  let saveTexts: string[] = JSON.parse(localStorage.getItem(Storage_KEY) || '[]');
  saveTexts.push(text);
  localStorage.setItem(Storage_KEY, JSON.stringify(saveTexts));
};

const handleSubmit = (e: Event): void => {
  e.preventDefault();
  console.log($myText.value);
  const inputText = $myText.value;

  if (inputText.trim() !== '') {
    addTextList(inputText);
    $myText.value = '';
    $myText.focus();
    saveToLocalStorage(inputText);
  } else {
    console.log('값을 입력해주세요');
  }
};

$form.addEventListener('submit', handleSubmit);

window.addEventListener('load', () => {
  let saveTexts: string[] = JSON.parse(localStorage.getItem(Storage_KEY) || '[]');
  saveTexts.forEach((text) => addTextList(text));
});
