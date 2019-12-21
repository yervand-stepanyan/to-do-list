const input = document.querySelector('input');
const btnAdd = document.querySelector('#btnAdd');
const list = document.querySelector('#list');
const ul = document.querySelector('ul');
const itemLeftDiv = document.querySelector('#itemLeft');
const clearCompleted = document.querySelector('#clear');
const btnAll = document.querySelector('#all');
const btnActive = document.querySelector('#active');
const btnCompleted = document.querySelector('#completed');
const smallButtons = [btnAll, btnActive, btnCompleted];

let listItems = [];
let activeItems = [];
let completedItems = [];
let activeItemsCount = 0;
let isCompletedClicked = false;
let route = "";

btnAdd.addEventListener("click", () => {
    addOnClickAndEnter();
});

input.addEventListener("keypress", event => {
    if (event.key === "Enter") {
        addOnClickAndEnter();
    }
});

clearCompleted.addEventListener("click", () => {
    clearElement(ul);

    listItems = [];
    listItems = [...activeItems];
    localStorage.setItem("listItems", JSON.stringify(listItems));

    if (completedItems.length === 0) {
        clearCompleted.style.visibility = "hidden";
        list.style.display = "none";

        localStorage.clear();
    }

    completedItems = [];
    localStorage.setItem("completedItems", JSON.stringify(completedItems));

    if (listItems.length === 0) {
        clearCompleted.style.visibility = "hidden";
        list.style.display = "none";

        localStorage.clear();

        isCompletedClicked = false;

        route = "";

        input.focus();
    }

    if (!isCompletedClicked) {
        activeItems.forEach(item => createContent(item.title));
    }
});

btnAll.addEventListener("click", () => {
    makeBtnActive(smallButtons, btnAll);

    isCompletedClicked = false;
    localStorage.setItem("isCompletedClicked", JSON.stringify(isCompletedClicked));

    clearElement(ul);

    listItems.forEach(item => createContent(item.title));

    route = "all";
    localStorage.setItem("route", JSON.stringify(route));
});

btnActive.addEventListener("click", () => {
    makeBtnActive(smallButtons, btnActive);
    isCompletedClicked = false;
    localStorage.setItem("isCompletedClicked", JSON.stringify(isCompletedClicked));

    if (activeItems.length !== 0 && listItems.length !== 0) {
        clearElement(ul);

        activeItems.forEach(item => createContent(item.title));
    } else {
        clearElement(ul);

        list.style.display = "block";
    }

    route = "active";
    localStorage.setItem("route", JSON.stringify(route));
});

btnCompleted.addEventListener("click", () => {
    makeBtnActive(smallButtons, btnCompleted);

    isCompletedClicked = true;
    localStorage.setItem("isCompletedClicked", JSON.stringify(isCompletedClicked));

    if (completedItems.length !== 0) {
        clearElement(ul);

        completedItems.forEach(item => createContent(item.title));
    } else {
        clearElement(ul);

        list.style.display = "block";
    }

    route = "completed";
    localStorage.setItem("route", JSON.stringify(route));
});

dataFromLocalStorage();

function addOnClickAndEnter() {
    add();

    if (route === "") {
        route = "all";
    }

    localStorage.setItem("listItems", JSON.stringify(listItems));
    localStorage.setItem("activeItems", JSON.stringify(activeItems));
    localStorage.setItem("completedItems", JSON.stringify(completedItems));
    localStorage.setItem("activeItemsCount", JSON.stringify(activeItemsCount));
    localStorage.setItem("isCompletedClicked", JSON.stringify(isCompletedClicked));
    localStorage.setItem("route", JSON.stringify(route));

    if (route === "active") {
        makeBtnActive(smallButtons, btnActive);
    } else if (route === "completed") {
        makeBtnActive(smallButtons, btnCompleted);
    } else {
        makeBtnActive(smallButtons, btnAll);
    }

    // list.style.display = "none";
}

function add() {
    if (input.value === "") {
        if (listItems) {
            if (route === "all") {
                btnAll.click();
            } else if (route === "active") {
                btnActive.click();
            } else if (route === "completed") {
                btnCompleted.click();
            }

            showItemsLeft(activeItemsCount, itemLeftDiv);
        }
    }

    const valueFromInput = input.value;
    const firstReplace = valueFromInput.replace(/\s\s+/g, ' ');
    const wsRegex = /^\s*|\s*$/g;
    const inputValue = firstReplace.replace(wsRegex, '');

    if (inputValue === "") {
        return;
    }


    listItems.push({title: inputValue, completed: false});
    activeItems = listItems.filter(item => item.completed === false);
    activeItemsCount = activeItems.length;

    localStorage.setItem("listItems", JSON.stringify(listItems));
    localStorage.setItem("activeItems", JSON.stringify(activeItems));
    localStorage.setItem("activeItemsCount", JSON.stringify(activeItemsCount));

    showItemsLeft(activeItemsCount, itemLeftDiv);

    if (route !== "completed") {
        createContent(inputValue);
    }

    input.value = "";
    input.focus();
}

function createContent(item) {
    const li = createElement("li", ['li']);
    const liDiv = createElement("div", ['liDiv']);
    const checkBox = createElement("input", ['checkBox']);
    checkBox.setAttribute("type", "checkbox");
    const text = createElement("span", ['spanText']);
    const buttonX = createElement("button", ["btnClose"]);

    text.textContent = item;
    buttonX.textContent = "X";
    buttonX.setAttribute("title", "Remove");
    liDiv.appendChild(checkBox);
    liDiv.appendChild(text);
    liDiv.appendChild(buttonX);
    li.appendChild(liDiv);
    ul.appendChild(li);

    list.style.display = "block";

    completedItems.forEach(item => {
        if (item.title === text.textContent) {
            text.style.textDecoration = "line-through";
            text.style.color = "#cccccc";
            checkBox.checked = true;
        }
    });

    if (completedItems.length > 0) {
        clearCompleted.style.visibility = "visible";
    }

    buttonX.addEventListener("click", (event) => {
        const removedValue = event.target.closest('li').innerText.slice(0, -2);

        const removedItem = listItems.find(item => item.title === removedValue);
        listItems = listItems.filter(item => item.title !== removedValue);
        activeItems = listItems.filter(item => item.completed === false);
        completedItems = completedItems.filter(item => item.title !== removedValue);

        localStorage.setItem("listItems", JSON.stringify(listItems));
        localStorage.setItem("activeItems", JSON.stringify(activeItems));
        localStorage.setItem("completedItems", JSON.stringify(completedItems));

        if (!removedItem.completed) {

            activeItemsCount -= 1;

            if (activeItemsCount < 0) {
                activeItemsCount = 0;
            }

            showItemsLeft(activeItemsCount, itemLeftDiv);

            localStorage.setItem("activeItemsCount", JSON.stringify(activeItemsCount));

            list.style.display = "block";
        } else {
            showItemsLeft(activeItemsCount, itemLeftDiv);
        }

        ul.removeChild(event.target.closest('li'));

        if (!ul.hasChildNodes()) {
            if (activeItemsCount === 0 && listItems.length === 0) {
                list.style.display = "none";

                input.focus();

                localStorage.clear();

                route = "";
            } else {
                list.style.display = "block";
            }
        }

        if (completedItems.length === 0) {
            clearCompleted.style.visibility = "hidden";
        }
    });

    text.addEventListener("click", () => {
        if (text.style.textDecoration === "") {
            listItems.find(item => item.title === text.innerText).completed = true;
            activeItems = listItems.filter(item => item.completed === false);
            completedItems = listItems.filter(item => item.completed === true);

            localStorage.setItem("listItems", JSON.stringify(listItems));
            localStorage.setItem("activeItems", JSON.stringify(activeItems));
            localStorage.setItem("completedItems", JSON.stringify(completedItems));

            if (completedItems.length > 0) {
                clearCompleted.style.visibility = "visible";
            }

            activeItemsCount -= 1;

            localStorage.setItem("activeItemsCount", JSON.stringify(activeItemsCount));
            showItemsLeft(activeItemsCount, itemLeftDiv);

            text.style.textDecoration = "line-through";
            text.style.color = "#cccccc";
            checkBox.checked = true;

            if (route === "active") {
                btnActive.click();
            }

        } else {
            listItems.find(item => item.title === text.innerText).completed = false;
            activeItems = listItems.filter(item => item.completed === false);
            completedItems = listItems.filter(item => item.completed === true);

            localStorage.setItem("listItems", JSON.stringify(listItems));
            localStorage.setItem("activeItems", JSON.stringify(activeItems));
            localStorage.setItem("completedItems", JSON.stringify(completedItems));

            if (completedItems.length === 0) {
                clearCompleted.style.visibility = "hidden";
            }

            activeItemsCount += 1;
            localStorage.setItem("activeItemsCount", JSON.stringify(activeItemsCount));
            showItemsLeft(activeItemsCount, itemLeftDiv);

            text.style.textDecoration = "";
            text.style.color = "black";
            checkBox.checked = false;

            if (isCompletedClicked) {
                btnCompleted.click();
            }
        }
    });

    checkBox.addEventListener("change", (event) => {
        if (event.target.checked) {
            listItems.find(item => item.title === text.innerText).completed = true;
            activeItems = listItems.filter(item => item.completed === false);
            completedItems = listItems.filter(item => item.completed === true);

            localStorage.setItem("listItems", JSON.stringify(listItems));
            localStorage.setItem("activeItems", JSON.stringify(activeItems));
            localStorage.setItem("completedItems", JSON.stringify(completedItems));

            if (completedItems.length > 0) {
                clearCompleted.style.visibility = "visible";
            }

            activeItemsCount -= 1;
            localStorage.setItem("activeItemsCount", JSON.stringify(activeItemsCount));
            showItemsLeft(activeItemsCount, itemLeftDiv);

            text.style.textDecoration = "line-through";
            text.style.color = "#cccccc";

            if (route === "active") {
                btnActive.click();
            }

        } else {
            listItems.find(item => item.title === text.innerText).completed = false;
            activeItems = listItems.filter(item => item.completed === false);
            completedItems = listItems.filter(item => item.completed === true);

            localStorage.setItem("listItems", JSON.stringify(listItems));
            localStorage.setItem("activeItems", JSON.stringify(activeItems));
            localStorage.setItem("completedItems", JSON.stringify(completedItems));

            if (completedItems.length === 0) {
                clearCompleted.style.visibility = "hidden";
            }

            activeItemsCount += 1;
            localStorage.setItem("activeItemsCount", JSON.stringify(activeItemsCount));
            showItemsLeft(activeItemsCount, itemLeftDiv);

            text.style.textDecoration = "";
            text.style.color = "black";

            if (isCompletedClicked) {
                btnCompleted.click();
            }
        }
    });

    text.addEventListener("dblclick", () => {
        console.log(text);
    });
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
    element.appendChild(itemLeft);
}

function makeBtnActive(all, clicked) {
    all.forEach(btn => {
        btn.style.border = "1px solid #a36f6f";
        btn.style.backgroundColor = "white";
        btn.style.color = "black";
    });

    clicked.style.border = "1px solid #5b0d0d";
    clicked.style.backgroundColor = "#5b0d0d";
    clicked.style.color = "white";
}

function dataFromLocalStorage() {
    if (localStorage.getItem("listItems") !== null) {
        listItems = JSON.parse(localStorage.getItem("listItems"));
        activeItems = JSON.parse(localStorage.getItem("activeItems"));
        completedItems = JSON.parse(localStorage.getItem("completedItems"));
        activeItemsCount = JSON.parse(localStorage.getItem("activeItemsCount"));
        isCompletedClicked = JSON.parse(localStorage.getItem("isCompletedClicked"));
        route = JSON.parse(localStorage.getItem("route"));

        add();
    }

    // console.log(listItems);
    // console.log(activeItems);
    // console.log(completedItems);
    // console.log(activeItemsCount);
    // console.log(isCompletedClicked);
}
