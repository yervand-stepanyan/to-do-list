const input = document.querySelector('input');
const button = document.querySelector('button');
const list = document.querySelector('#list');
const ul = document.querySelector('ul');

button.addEventListener("click", () => {
    add();
});

input.addEventListener("keypress", event => {
    if (event.key === "Enter")
        add();
});

function add() {
    const inputValue = input.value;

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

