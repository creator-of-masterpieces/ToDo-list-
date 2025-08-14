// Класс для создания и управления элементом списка задач
import {IItem} from "../types";

// Интерфейс для элемента списка задач.
// Определяет свойства и методы:
//      - render - возвращает HTML-элемент задачи;
//      - setCopyHandler - принимает и устанавливает функцию обработчик клика по кнопке копирования
//      - setDeleteHandler - принимает и устанавливает функцию обработчик клика по кнопке удаления
export interface IViewItem {
    id: string;
    name: string;
    render(item: IItem): HTMLElement;
    setCopyHandler(handleCopyItem: Function): void;
    setDeleteHandler(handleDeleteitem: Function): void;
}

// Интерфейс конструктора элемента списка задач.
// Указывает, что класс должен принимать HTML-шаблон и возвращать объект IViewItem
export interface IViewitemConstructor {
    new(template: HTMLTemplateElement): IViewItem;
}

export class Item implements IViewItem {
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
    // Функция-обработчик клика по кнопке копирования элемента
    protected handleCopyItem: Function;
    // Функция-обработчик клика по кнопке удаления элемента
    protected handleDeleteitem: Function;

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
        this.itemElement = template.content.querySelector(".todo-item").cloneNode(true) as HTMLElement;
        this.title = this.itemElement.querySelector(".todo-item__text");
        this.copyButton = this.itemElement.querySelector('.todo-item__copy');
        this.deleteButton = this.itemElement.querySelector('.todo-item__del');
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
     * Устанавливает обработчик клика по кнопке копирования задачи
     * @param handleCopyItem — функция-обработчик, которая будет вызываться при нажатии на кнопку копирования
     *
     * 1. Сохраняет переданную функцию в свойство `handleCopyItem`.
     *    Это позволяет вызывать её позже в момент клика по кнопке.
     * 2. Добавляет обработчик события `click` на кнопку копирования `copyButton`.
     *    При клике вызывается сохранённая функция и в неё передаётся текущий экземпляр задачи (`this`).
     *    Таким образом, обработчик получает доступ ко всем данным и методам этого элемента.
     */
    setCopyHandler(handleCopyItem: Function) {
        this.handleCopyItem = handleCopyItem;
        this.copyButton.addEventListener('click', (evt)=> {
            this.handleCopyItem(this)
        })
    }

    /**
     * Устанавливает обработчик клика по кнопке удаления задачи
     * @param handleDeleteItem — функция-обработчик, которая будет вызываться при нажатии на кнопку удаления
     *
     * 1. Сохраняет переданную функцию в свойство `handleDeleteitem`,
     *    чтобы её можно было вызвать при нажатии на кнопку.
     * 2. Добавляет обработчик события `click` на кнопку удаления `deleteButton`.
     * 3. При клике вызывается сохранённая функция и в неё передаётся текущий экземпляр задачи (`this`),
     *    что позволяет обработчику получить доступ к её данным (`id`, `name`) и DOM-элементу.
     *
     * Этот метод связывает конкретную задачу с логикой удаления,
     * которую определяет презентер или контроллер.
     */
    setDeleteHandler(handleDeleteItem: Function) {
        this.handleDeleteitem = handleDeleteItem;
        this.deleteButton.addEventListener('click', (evt) => {
            this.handleDeleteitem(this);
        })
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
