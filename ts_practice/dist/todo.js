"use strict";
const $form = document.querySelector('form');
const $myText = document.querySelector('#myText');
const $textList = document.querySelector('.textList');
const Storage_KEY = 'saveTexts';
const addTextList = (text) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="text">${text}</span>`;
    $textList.prepend(li);
};
const saveToLocalStorage = (text) => {
    let saveTexts = JSON.parse(localStorage.getItem(Storage_KEY) || '[]');
    saveTexts.push(text);
    localStorage.setItem(Storage_KEY, JSON.stringify(saveTexts));
};
const handleSubmit = (e) => {
    e.preventDefault();
    console.log($myText.value);
    const inputText = $myText.value;
    if (inputText.trim() !== '') {
        addTextList(inputText);
        $myText.value = '';
        $myText.focus();
        saveToLocalStorage(inputText);
    }
    else {
        console.log('값을 입력해주세요');
    }
};
$form.addEventListener('submit', handleSubmit);
window.addEventListener('load', () => {
    let saveTexts = JSON.parse(localStorage.getItem(Storage_KEY) || '[]');
    saveTexts.forEach((text) => addTextList(text));
});
