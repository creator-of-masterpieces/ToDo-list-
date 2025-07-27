import "./styles/styles.css"

// Импорт списка задач
import {todos} from "./utils/constants"

// Импорт классов
import {Item} from "./components/Item";
import {Form} from "./components/form";


// Элемент шаблона
const template = document.querySelector("#todo-item-template") as HTMLTemplateElement;

// Элемент список дел
const contentElement = document.querySelector(".todos__list");

// Элемент формы
const formElement = document.querySelector('.todos__form') as HTMLFormElement;

// Экземпляр формы
const todoForm = new Form(formElement, handleSubmitForm);

// Обработчик оправки формы
function handleSubmitForm(data: string) {
    const todoItem = new Item(template);
    const itemElement = todoItem.render(data);
    contentElement.prepend(itemElement);
    todoForm.clearValue();
}

// Перебирает массив с названиями дел.
// Создает объект - элемент списка.
// Вызывает метод, который устанавливает название как заголовок элемента и возвращает HTML элемент.
// Добавляет HTML элемент на страницу
todos.forEach(item => {
    const todoItem = new Item(template);
    const itemElement = todoItem.render(item);
    contentElement.prepend(itemElement);
})

