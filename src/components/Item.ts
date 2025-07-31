// Класс для создания элемента списка
import {IItem} from "../types";

export class Item {
    // Элемент списка дел
    protected itemElement: HTMLElement;

    // Заголовок списка дел
    protected title: HTMLElement;

    // id элемента
    protected _id: string;

    // Принимает шаблон элемента списка дел.
    // Устанавливает значения элемента списка и заголовка
    constructor(template: HTMLTemplateElement) {
        this.itemElement = template.content.querySelector(".todo-item").cloneNode(true) as HTMLElement;
        this.title = this.itemElement.querySelector(".todo-item__text");
    }

    // Принимает строку - id элемента
    // Записывает строку в свойство _id
    set id(value: string) {
        this._id = value;
    }

    get id() : string {
        return this._id || '';
    }

    // Принимает строку - заголовок элемента.
    // Записывает строку в содержимое HTML элемента title.
    set name(value: string) {
        this.title.textContent = value;
    }

    get name(): string {
        return this.title.textContent || '';
    }

    // Принимает объект - элемент списка.
    // Устанавливает значение свойства name как заголовок элемента c помощью сетера name.
    // Устанавливает значение свойства id как id элемента.
    // Возвращает элемент
    render(item: IItem): HTMLElement {
        this.name = item.name;
        this.id = item.id;
        return this.itemElement;
    }
}
