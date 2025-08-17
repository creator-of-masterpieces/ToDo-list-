/**
 * Точка входа приложения ToDo-list.
 * Здесь инициализируются все основные части приложения:
 * - модель (ToDoModel) — для хранения и управления списком дел;
 * - представления (Page, Item, Form, Popup) — для работы с DOM;
 * - презентер (ItemPresenter) — связывает модель и представления;
 * - инициализация событий и первичная отрисовка.
 */

import "./styles/styles.css"

// Импорт начального списка задач (массив объектов) — из констант проекта
import {todos} from "./utils/constants"

// Импорт классов компонентов приложения
import {Item} from "./components/Item";
import {Form} from "./components/Form";
import {ToDoModel} from "./components/ToDoModel";
import {Page} from "./components/Page";
import {ItemPresenter} from "./components/ToDoPresenter";
import {Popup} from "./components/Popup";

// Получаем ссылку на контейнер — в него будет отрисована форма и список задач
const contentElement = document.querySelector('.content') as HTMLElement;

// Получаем ссылку на контейнер для модального окна — используется в Popup
const popupElement = document.querySelector('.popup') as HTMLElement;

// Создаём экземпляр класса Page, который управляет структурой страницы:
// хранит контейнер для формы и список задач.
const itemContainer = new Page(contentElement);

// Создаём экземпляр модели ToDoModel — объект для хранения и управления данными задач.
// Модель реализует операции добавление/удаление/редактирование/переключение статуса.
const todoArray = new ToDoModel();

// Инициализируем модель начальными задачами, импортированными из constants.ts
todoArray.items = todos;

// Создаём попап — UI-контейнер для форм редактирования/подтверждений
const modal = new Popup(popupElement);

// Создаём презентер (ItemPresenter) — координирует взаимодействие между слоями
// Презентер координирует взаимодействие между:
// - моделью данных (todoArray); — источник состояния и бизнес-операции;
// - формами (Form); — ввод данных пользователем и эмит событий намерений;
// - представлением страницы (itemContainer); — доступ к DOM-контейнерам и рендер;
// - элементами списка задач (Item); — карточки задач и их пользовательские события;
// - модальным окном (modal); — сценарии редактирования и подтверждений.
const itemPresentor = new ItemPresenter(todoArray, Form, itemContainer, Item, modal);

// Инициализация приложения:
// создаёт форму добавления задачи, задаёт обработчики событий и вставляет форму на страницу.
itemPresentor.init();

// Первая отрисовка интерфейса:
// формирует DOM-элементы для всех задач из модели и отображает их на странице.
itemPresentor.renderView();