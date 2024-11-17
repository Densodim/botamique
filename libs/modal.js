export function openModal() {
    const openModalButton = document.getElementById('openModalButton');
    const modal = document.getElementById('modal');
    const closeModalButton = document.getElementById('closeModalButton');
    const hideElement1Checkbox = document.getElementById('hideElementCheckbox');
    const elementHide = document.getElementById('elementHide');

    openModalButton.addEventListener('click', () => {
        modal.style.display = 'flex';
        hideElement1Checkbox.checked = elementHide.style.display === 'none';
    });

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    hideElement1Checkbox.addEventListener('change', ()=>{
        if(hideElement1Checkbox.checked){
            elementHide.style.display = 'none';
        }else {
            elementHide.style.display = 'flex';
        }
    })
}