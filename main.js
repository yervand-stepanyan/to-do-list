const input = document.querySelector('input');
const btnAdd = document.querySelector('#btnAdd');
const list = document.querySelector('#list');
const ul = document.querySelector('ul');
const itemLeftDiv = document.querySelector('#itemLeft');
const clearCompleted = document.querySelector('#clearSpan');
const btnAll = document.querySelector('#all');
const btnActive = document.querySelector('#active');
const btnCompleted = document.querySelector('#completed');
const selectAllDiv = document.querySelector('#selectAll');
const selectAllIcon = document.querySelector('.down');
const smallButtons = [btnAll, btnActive, btnCompleted];

let listItems = [];
let activeItems = [];
let completedItems = [];
let activeItemsCount = 0;
let isCompletedClicked = false;
let route = "";
let isSelectAllClicked = false;
let clickCount = 0;
let singleClickTimer;
let checkboxNum = 0;

btnAdd.addEventListener("click", () => {
  addOnClickAndEnter();
});

input.addEventListener("keypress", event => {
  if (event.key === "Enter") {
    addOnClickAndEnter();
  }
});

clearCompleted.addEventListener("click", () => {
  checkboxNum = 0;

  clearElement(ul);

  listItems = [];
  listItems = [...activeItems];
  localStorage.setItem("listItems", JSON.stringify(listItems));

  completedItems = [];
  localStorage.setItem("completedItems", JSON.stringify(completedItems));

  if (completedItems.length === 0) {
    clearCompleted.style.visibility = "hidden";
  }

  if (listItems.length === 0 && completedItems.length === 0) {
    clearCompleted.style.visibility = "hidden";

    list.style.display = "none";

    localStorage.clear();

    isCompletedClicked = false;

    route = "";

    input.focus();

    selectAllDiv.style.visibility = "hidden";

    isSelectAllClicked = false;

    selectAllIcon.classList.remove("selectAllClicked");

    checkboxNum = 0;
  }

  if (!isCompletedClicked) {
    activeItems.forEach(item => createContent(item.title));
  }
});

btnAll.addEventListener("click", () => {
  checkboxNum = 0;

  makeBtnActive(smallButtons, btnAll);

  isCompletedClicked = false;
  localStorage.setItem("isCompletedClicked", JSON.stringify(isCompletedClicked));

  clearElement(ul);

  listItems.forEach(item => createContent(item.title));

  route = "all";
  localStorage.setItem("route", JSON.stringify(route));
});

btnActive.addEventListener("click", () => {
  checkboxNum = 0;

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
  checkboxNum = 0;

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

selectAllIcon.addEventListener("click", () => {
  checkboxNum = 0;

  isSelectAllClicked = !isSelectAllClicked;

  if (listItems.length === completedItems.length) {
    isSelectAllClicked = false;
  }

  if (isSelectAllClicked) {
    listItems.forEach(item => {
      item.completed = true;
    });

    selectAllIcon.classList.add("selectAllClicked");
  } else {
    listItems.forEach(item => {
      item.completed = false;
    });

    selectAllIcon.classList.remove("selectAllClicked");
  }

  activeItems = listItems.filter(item => item.completed === false);
  completedItems = listItems.filter(item => item.completed === true);

  if (listItems[0].completed) {
    activeItemsCount = 0;
  } else {
    activeItemsCount = listItems.length;
  }

  localStorage.setItem("listItems", JSON.stringify(listItems));
  localStorage.setItem("activeItems", JSON.stringify(activeItems));
  localStorage.setItem("completedItems", JSON.stringify(completedItems));
  localStorage.setItem("activeItemsCount", JSON.stringify(activeItemsCount));

  showItemsLeft(activeItemsCount, itemLeftDiv);

  if (route === "all") {
    btnAll.click();
  } else if (route === "active") {
    btnActive.click();
  } else if (route === "completed") {
    btnCompleted.click();
  }

  if (completedItems.length === 0) {
    clearCompleted.style.visibility = "hidden";
  }

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

  selectAllDiv.style.visibility = "visible";

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
  checkboxNum += 1;

  const li = createElement("li", ['li']);
  const liDiv = createElement("div", ['liDiv']);
  const checkBoxDiv = createElement("div", ['checkBoxDiv']);
  const checkBox = createElement("input", ['css-checkbox']);
  checkBox.setAttribute("type", "checkbox");
  checkBox.setAttribute("id", `checkbox${checkboxNum}`);
  const labelForCheckBox = createElement("label", ['css-label']);
  labelForCheckBox.setAttribute("for", `checkbox${checkboxNum}`);
  const text = createElement("span", ['spanText']);
  const buttonX = createElement("button", ["btnClose"]);

  text.textContent = item;
  buttonX.textContent = "X";
  buttonX.setAttribute("title", "Remove");
  checkBoxDiv.appendChild(checkBox);
  checkBoxDiv.appendChild(labelForCheckBox);
  liDiv.appendChild(checkBoxDiv);
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

        selectAllDiv.style.visibility = "hidden";

        isSelectAllClicked = false;

        checkboxNum = 0;
      } else {
        list.style.display = "block";

        selectAllDiv.style.visibility = "hidden";
      }
    }

    if (completedItems.length === 0) {
      clearCompleted.style.visibility = "hidden";
    }
  });

  text.addEventListener("click", () => {
    clickCount++;

    if (clickCount === 1) {
      singleClickTimer = setTimeout(function () {
        clickCount = 0;
        textSingleClick(text, checkBox);
      }, 400);
    } else if (clickCount === 2) {
      clearTimeout(singleClickTimer);
      clickCount = 0;
      textDoubleClick(liDiv, text, buttonX);
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

      if (listItems.length === completedItems.length) {
        isSelectAllClicked = true;
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

      isSelectAllClicked = false;
    }
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
  itemLeft.textContent = (arrayLength === 0 || arrayLength > 1) ? `${arrayLength} items left` :
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

    selectAllDiv.style.visibility = "visible";
  }
}

function textSingleClick(textElement, checkboxElement) {
  if (textElement.style.textDecoration === "") {
    listItems.find(item => item.title === textElement.innerText).completed = true;
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

    textElement.style.textDecoration = "line-through";
    textElement.style.color = "#cccccc";
    checkboxElement.checked = true;

    if (route === "active") {
      btnActive.click();
    }

    if (listItems.length === completedItems.length) {
      isSelectAllClicked = true;
    }

  } else {
    listItems.find(item => item.title === textElement.innerText).completed = false;
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

    textElement.style.textDecoration = "";
    textElement.style.color = "black";
    checkboxElement.checked = false;

    if (isCompletedClicked) {
      btnCompleted.click();
    }

    isSelectAllClicked = false;
  }
}

function textDoubleClick(divElement, textElement, buttonRemove) {
  const changeInput = createElement("input", ["changeInput"]);
  const textToChange = textElement.textContent;

  changeInput.setAttribute("value", textToChange);
  changeInput.setAttribute("placeholder", "* Can not be empty");

  divElement.replaceChild(changeInput, textElement);

  changeInput.focus();
  const inpValue = changeInput.value;
  changeInput.value = "";
  changeInput.value = inpValue;

  buttonRemove.style.visibility = "hidden";

  changeInput.addEventListener("keypress", event => {
    if (event.key === "Enter") {
      changeValueToText(changeInput, textElement, divElement, buttonRemove, textToChange);
    }
  });

  changeInput.addEventListener("focusout", () => {
    setTimeout(() => {
      changeValueToText(changeInput, textElement, divElement, buttonRemove, textToChange);
    });
  });
}

function changeValueToText(changeInput, textElement, divElement, buttonRemove, textToChange) {
  const valueFromInput = changeInput.value;
  const firstReplace = valueFromInput.replace(/\s\s+/g, ' ');
  const wsRegex = /^\s*|\s*$/g;
  const changedValue = firstReplace.replace(wsRegex, '');

  if (changedValue === "") {
    changeInput.focus();

    changeInput.style.border = "1px solid red";
  } else {
    let hasInput = divElement.contains(changeInput);

    if (hasInput) {
      textElement.textContent = changedValue;
      divElement.replaceChild(textElement, changeInput);

      buttonRemove.style.visibility = "visible";

      listItems.forEach(item => {
        if (item.title === textToChange) {
          item.title = changedValue;
        }
      });

      activeItems.forEach(item => {
        if (item.title === textToChange) {
          item.title = changedValue;
        }
      });

      completedItems.forEach(item => {
        if (item.title === textToChange) {
          item.title = changedValue;
        }
      });

      localStorage.setItem("listItems", JSON.stringify(listItems));
      localStorage.setItem("activeItems", JSON.stringify(activeItems));
      localStorage.setItem("completedItems", JSON.stringify(completedItems));
    } else {
      return false;
    }
  }
}
