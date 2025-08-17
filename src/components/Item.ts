// Класс для создания и управления элементом списка задач
import {IItem} from "../types";
import {EventEmitter, IEvents} from "./EventEmitter";

// Интерфейс для элемента списка задач.
// Определяет свойства и методы:
//      - render - возвращает HTML-элемент задачи.
//      - setCopyHandler - принимает и устанавливает функцию обработчик клика по кнопке копирования.
//      - setDeleteHandler - принимает и устанавливает функцию обработчик клика по кнопке удаления.
//      - setEditHandler - принимает и устанавливает функцию обработчик клика по кнопке редактирования.
export interface IViewItem extends IEvents {
    id: string;
    name: string;
    render(item: IItem): HTMLElement;
}

// Интерфейс конструктора элемента списка задач.
// Указывает, что класс должен принимать HTML-шаблон и возвращать объект IViewItem
export interface IViewItemConstructor {
    new(template: HTMLTemplateElement): IViewItem;
}

export class Item extends EventEmitter implements IViewItem {
    // DOM-элемент задачи (обёртка)
    protected itemElement: HTMLElement;
    // DOM-элемент с текстом задачи
    protected title: HTMLElement;
    // id задачи
    protected _id: string;
    // Кнопка копирования элемента
    protected copyButton: HTMLButtonElement;
    // Кнопка удаления элемента
    protected deleteButton: HTMLButtonElement;
    // Кнопка редактирования элемента
    protected editButton: HTMLButtonElement;

    /**
     * Конструктор класса Item
     * @param template - HTML-шаблон элемента списка задач
     *
     * Клонирует шаблон элемента списка и сохраняет ссылки на его части:
     * - itemElement — корневой элемент задачи
     * - title — элемент с заголовком задачи
     * - copyButton - кнопка копирования задачи
     * - deleteButton - кнопка удаления задачи
     */
    constructor(template: HTMLTemplateElement) {
        super();
        this.itemElement = template.content.querySelector(".todo-item").cloneNode(true) as HTMLElement;
        this.title = this.itemElement.querySelector(".todo-item__text");
        this.copyButton = this.itemElement.querySelector('.todo-item__copy');
        this.deleteButton = this.itemElement.querySelector('.todo-item__del');
        this.editButton = this.itemElement.querySelector('.todo-item__edit');

        this.copyButton.addEventListener('click', () => this.emit('copy', {id: this._id}));
        this.deleteButton.addEventListener('click', () => this.emit('delete', {id: this._id}));
        this.editButton.addEventListener('click', () => this.emit('edit', {id: this._id}));
    }

    // Устанавливает id элемента задачи
    set id(value: string) {
        this._id = value;
    }

    // Возвращает id задачи, либо пустую строку, если id не установлен
    get id() : string {
        return this._id || '';
    }

    // Устанавливает текст задачи
    set name(value: string) {
        this.title.textContent = value;
    }

    // Возвращает текст задачи, либо пустую строку, если текст не установлен
    get name(): string {
        return this.title.textContent || '';
    }

    /**
     * Рендерит DOM-элемент задачи на основе переданных данных
     * @param item — объект задачи с полями id и name
     *
     * Сохраняет id и текст задачи с помощью соответствующих сеттеров.
     * Возвращает готовый HTML-элемент для вставки на страницу
     */
    render(item: IItem) {
        this.name = item.name;
        this.id = item.id;
        return this.itemElement;
    }
}
