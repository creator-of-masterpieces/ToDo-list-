import "./styles/styles.css"

// Импорт начального списка задач
import {todos} from "./utils/constants"

// Импорт классов компонентов приложения
import {Item} from "./components/Item";
import {Form} from "./components/Form";
import {ToDoModel} from "./components/ToDoModel";
import {Page} from "./components/Page";
import {ItemPresenter} from "./components/ToDoPresenter";
import {Popup} from "./components/Popup";

// Находим контейнер, в который будут отрисованы форма и список дел
const contentElement = document.querySelector('.content') as HTMLElement;

// Находим контейнер модального окна (попапа)
const popupElement = document.querySelector('.popup') as HTMLElement;

// Создаём экземпляр класса Page, который управляет структурой страницы:
// хранит контейнер для формы и список задач.
const itemContainer = new Page(contentElement);

// Создаём экземпляр модели ToDoModel — объект для хранения и управления данными задач.
// Модель реализует операции добавления, удаления, редактирования и получения задач.
const todoArray = new ToDoModel();

// Инициализируем модель начальными задачами, импортированными из constants.ts
todoArray.items = todos;

// Создаём экземпляр попапа (модального окна), который используется для редактирования задачи
const modal = new Popup(popupElement);

// Создаём экземпляр презентера (ItemPresenter).
// Презентер координирует взаимодействие между:
// - моделью данных (todoArray);
// - формами (Form);
// - представлением страницы (itemContainer);
// - элементами списка задач (Item);
// - модальным окном (modal).
const itemPresentor = new ItemPresenter(todoArray, Form, itemContainer, Item, modal);

// Инициализация приложения:
// создаёт форму добавления задачи, задаёт обработчики событий и вставляет форму на страницу.
itemPresentor.init();

// Первая отрисовка интерфейса:
// формирует DOM-элементы для всех задач из модели и отображает их на странице.
itemPresentor.renderView();