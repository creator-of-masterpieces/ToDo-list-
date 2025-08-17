/**
 * Компонент `Item` — отвечает за отображение и управление отдельной задачей.
 * Слой: View.
 *
 * Взаимодействие:
 * - получает данные задачи (id и name) и отображает их в DOM;
 * - пробрасывает события наружу при клике по кнопкам (copy, delete, edit);
 * - не содержит бизнес-логики; — только UI и эмит событий.
 */
import {IItem} from "../types";
import {EventEmitter, IEvents} from "./EventEmitter";

/**
 * Интерфейс для элемента списка задач.
 * Определяет:
 * - `id` (getter/setter); — уникальный идентификатор задачи;
 * - `name` (getter/setter); — текстовое название задачи;
 * - `render(item: IItem)`; — возвращает готовый DOM-элемент.
 */
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

/**
 * Класс `Item` — реализация IViewItem.
 * Отвечает за:
 * - клонирование шаблона задачи;
 * - отображение текста и хранение id;
 * - навешивание слушателей на кнопки действий;
 * - генерацию событий copy/delete/edit.
 */
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
     * @param template HTML-шаблон задачи (будет клонирован)
     *
     * Конструктор:
     * - клонирует шаблон;
     * - сохраняет ссылки на элементы (текст, кнопки);
     * - вешает обработчики кликов, эмитящие события наружу.
     */
    constructor(template: HTMLTemplateElement) {
        super();
        this.itemElement = template.content.querySelector(".todo-item").cloneNode(true) as HTMLElement;
        this.title = this.itemElement.querySelector(".todo-item__text");
        this.copyButton = this.itemElement.querySelector('.todo-item__copy');
        this.deleteButton = this.itemElement.querySelector('.todo-item__del');
        this.editButton = this.itemElement.querySelector('.todo-item__edit');

        // Проброс событий наружу через EventEmitter
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
     * Отрисовывает DOM-элемент задачи на основе данных.
     * @param item — объект с полями id и name
     * Устанавливает id и текст задачи через сеттеры и возвращает готовый DOM-элемент.
     */
    render(item: IItem) {
        this.name = item.name;
        this.id = item.id;
        return this.itemElement;
    }
}
