import "./styles/styles.css"

// Импорт начального списка задач
import {todos} from "./utils/constants"

// Импорт классов компонентов приложения
import {Item} from "./components/Item";
import {Form} from "./components/Form";
import {ToDoModel} from "./components/ToDoModel";
import {Page} from "./components/Page";
import {ItemPresenter} from "./components/ToDoPresenter";

// Находим контейнер, в который будем отрисовывать форму и список дел
const contentElement = document.querySelector('.content') as HTMLElement;

// Создаём экземпляр класса Page, который управляет структурой страницы
const itemContainer = new Page(contentElement);

// Создаём экземпляр модели Tоdo — будет хранить и управлять данными задач
const todoArray = new ToDoModel();

// Инициализируем модель начальными задачами, импортированными из constants.ts
todoArray.items = todos;

const itemPresentor = new ItemPresenter(todoArray, Form, itemContainer, Item);

itemPresentor.init();
itemPresentor.renderView();