import "./styles/styles.css"

// Импортирует список задач
import {todos} from "./utils/constants"

// HTML список дел
const contentElement = document.querySelector(".todos__list");

// HTML шаблон
const template = document.querySelector("#todo-item-template") as HTMLTemplateElement;

// Принимает строку, клонирует шаблон элемента списка,
// записывает в заголовок списка переданную строку,
// возвращает заполненный элемент списка
function createElement(item: string) {
    const itemElement = template.content.querySelector(".todo-item").cloneNode(true) as HTMLElement;
    const title = itemElement.querySelector(".todo-item__text");
    title.textContent = item;
    return itemElement;
}

// Перебирает массив с названиями дел, и вставляет названия в элементы списка, добавляет их в список на страницу
todos.forEach(item => {
    const itemElement = createElement(item);
    contentElement.prepend(itemElement);
})

