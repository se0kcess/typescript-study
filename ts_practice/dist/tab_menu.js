"use strict";
{
    // const tabButtons = document.getElementById("tab-buttons")! as HTMLDivElement;
    const tabButtons = document.getElementById('tab-buttons');
    // const tabContents = document.querySelectorAll(".tab-content") as NodeListOf<Element>;
    const tabContents = document.querySelectorAll('.tab-content');
    function openTab(i) {
        tabContents.forEach((content, index) => {
            content.classList.toggle('active', index === i - 1);
        });
        tabButtons.querySelectorAll('button').forEach((button) => {
            button.classList.toggle('active', button.dataset.btnindex === i.toString());
        });
    }
    tabButtons.addEventListener('click', (event) => {
        const clickedButton = event.target.closest('button');
        if (clickedButton instanceof HTMLButtonElement) {
            const i = parseInt(clickedButton.dataset.btnindex || '', 10);
            if (!isNaN(i))
                openTab(i);
        }
    });
    openTab(1);
}
