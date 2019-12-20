const input = document.querySelector('input');
const button = document.querySelector('button');
const list = document.querySelector('#list');
const ul = document.querySelector('ul');
const item = document.querySelector('#item');
let listItems = {
    active: [],
    completed: []
};
let activeItemsCount = 0;

button.addEventListener("click", () => {
    add();
});

input.addEventListener("keypress", event => {
    if (event.key === "Enter")
        add();
});

function add() {
    const inputValue = input.value;

    if (inputValue === "") {
        return;
    }

    listItems.active.push(inputValue);
    activeItemsCount = listItems.active.length;

    showItemsLeft(activeItemsCount, item);

    const li = createElement("li", ['li']);
    const liDiv = createElement("div", ['liDiv']);
    const checkBox = createElement("input", ['checkBox']);
    checkBox.setAttribute("type", "checkbox");
    const text = createElement("span", ['spanText']);
    const buttonX = createElement("button", ["btnClose"]);

    text.textContent = inputValue;
    buttonX.textContent = "X";
    liDiv.appendChild(checkBox);
    liDiv.appendChild(text);
    liDiv.appendChild(buttonX);
    li.appendChild(liDiv);
    ul.appendChild(li);

    list.style.display = "block";

    buttonX.addEventListener("click", (event) => {
        // const removedValue = event.target.closest('li').innerText.slice(0, -1);
        // // console.log(listItems.active);
        // // listItems.active = listItems.active.filter(item => item !== liValue);
        // console.log(removedValue);
        // console.log(listItems.active);
        // const newArr = listItems['active'].filter(item => item === removedValue);
        // console.log(newArr);


        activeItemsCount -= 1;

        showItemsLeft(activeItemsCount, item);
        ul.removeChild(event.target.closest('li'));

        if (!ul.hasChildNodes()) {
            list.style.display = "none";
            input.focus();
        }
    });

    text.addEventListener("click", () => {
        if (text.style.textDecoration === "") {
            text.style.textDecoration = "line-through";
            text.style.color = "#cccccc";
            checkBox.checked = true;
        } else {
            text.style.textDecoration = "";
            text.style.color = "black";
            checkBox.checked = false;
        }
    });

    checkBox.addEventListener("change", (event) => {
        if (event.target.checked) {
            text.style.textDecoration = "line-through";
            text.style.color = "#cccccc";
        } else {
            text.style.textDecoration = "";
            text.style.color = "black";
        }
    });

    input.value = "";
    input.focus();
}

function createElement(tagName, classList = []) {
    const element = document.createElement(tagName);
    element.classList.add(...classList);

    return element;
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function showItemsLeft(arrayLength, element) {
    clearElement(element);
    const itemLeft = createElement("span", ['itemLeftSpan']);
    itemLeft.textContent = (arrayLength > 1) ? `${arrayLength} items left` :
        `${arrayLength} item left`;
    item.appendChild(itemLeft);
}

