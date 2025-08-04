import "./styles/styles.css"

// Импорт списка задач
import {todos} from "./utils/constants"

// Импорт классов
import {Item} from "./components/Item";
import {Form} from "./components/Form";
import {ToDoModel} from "./components/ToDoModel";
import {Page} from "./components/Page";

// Контейнер для содержимого страницы
const contentElement = document.querySelector('.contentElement') as HTMLElement;

// Шаблон элемента списка дел
const itemTemplate = document.querySelector('#todo-item-template') as HTMLTemplateElement;

// Шаблон формы
const formTemplate = document.querySelector('#todo-form-template') as HTMLTemplateElement;

// Элемент формы
const formElement = document.querySelector('.todos__form') as HTMLFormElement;

// Экземпляр страницы
const page = new Page(contentElement);

// Массив с элементами списка дел
const todoArray = new ToDoModel();

// Записывает в массив начальный массив элементов списка дел
todoArray.items = todos;

// Экземпляр формы
const todoForm = new Form(formTemplate);

// Устанавливает обработчик отправки формы
todoForm.setHandler(handleSubmitForm);

// Добавляет элемент формы на страницу
page.formContainer = todoForm.render();

// Обработчик оправки формы.
// Принимает строку из поля формы.
// Создает экземпляр элемента списка.
// Создает и добавляет на страницу html элемент списка.
// Очищает поля формы
function handleSubmitForm(data: string) {
    todoArray.addItem(data);
    todoForm.clearValue();
    renderTodoItems();
}

// Перебирает массив с названиями дел, который получил из хранилища элементов списка дел.
// Создает объект - элемент списка.
// Вызывает метод, который устанавливает название как заголовок элемента и возвращает HTML элемент.
// Возвращает созданный элемент.
// Добавляет элемент на страницу с помощью метода объекта page.

function renderTodoItems() {
    page.todoContainer = todoArray.items.map(item => {
        const todoItem = new Item(itemTemplate);
        const itemElement = todoItem.render(item);
        return (itemElement);
    }).reverse()
}

renderTodoItems();

