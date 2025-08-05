import "./styles/styles.css"

// Импорт начального списка задач
import {todos} from "./utils/constants"

// Импорт классов компонентов приложения
import {Item} from "./components/Item";
import {Form} from "./components/Form";
import {ToDoModel} from "./components/ToDoModel";
import {Page} from "./components/Page";

// Находим контейнер, в который будем отрисовывать форму и список дел
const contentElement = document.querySelector('.content') as HTMLElement;

// Получаем шаблон элемента списка задач
const itemTemplate = document.querySelector('#todo-item-template') as HTMLTemplateElement;

// Получаем шаблон формы добавления задачи
const formTemplate = document.querySelector('#todo-form-template') as HTMLTemplateElement;

// Создаём экземпляр класса Page, который управляет структурой страницы
const page = new Page(contentElement);

// Создаём экземпляр модели Tоdo — будет хранить и управлять данными задач
const todoArray = new ToDoModel();

// Инициализируем модель начальными задачами, импортированными из constants.ts
todoArray.items = todos;

// Создаём экземпляр формы для добавления новых задач
const todoForm = new Form(formTemplate);

// Устанавливаем обработчик события отправки формы
todoForm.setHandler(handleSubmitForm);

// Добавляем сгенерированный элемент формы на страницу
page.formContainer = todoForm.render();

/**
 * Обработчик оправки формы
 * @param data - строка, введённая пользователем
/* Добавляет новую задачу в список,
 * очищает поле ввода
 * и заново отрисовывает все задачи
 */
function handleSubmitForm(data: string) {
    todoArray.addItem(data);
    todoForm.clearValue();
    renderTodoItems();
}

/**
 * Отрисовка всех задач
 *
 * Перебирает массив задач из todoArray,
 * для каждой создаёт объект Item,
 * генерирует для него HTML-элемент с текстом задачи,
 * возвращает массив этих элементов и отображает их на странице в обратном порядке (последние сверху)
*/
function renderTodoItems() {
    page.todoContainer = todoArray.items.map(item => {
        const todoItem = new Item(itemTemplate);
        const itemElement = todoItem.render(item);
        return (itemElement);
    }).reverse()
}

// Первичная отрисовка задач при загрузке страницы
renderTodoItems();

