// Класс для создания и управления элементом списка задач
import {IItem} from "../types";

export class Item {
    // DOM-элемент задачи (обёртка)
    protected itemElement: HTMLElement;

    // DOM-элемент с текстом задачи
    protected title: HTMLElement;

    // id задачи
    protected _id: string;

    /**
     * Конструктор класса Item
     * @param template - HTML-шаблон элемента списка задач
     *
     * Клонирует шаблон элемента списка и сохраняет ссылки на его части:
     * - `.todo-item` — корневой элемент задачи
     * - `.todo-item__text` — элемент с заголовком задачи
     */
    constructor(template: HTMLTemplateElement) {
        this.itemElement = template.content.querySelector(".todo-item").cloneNode(true) as HTMLElement;
        this.title = this.itemElement.querySelector(".todo-item__text");
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
