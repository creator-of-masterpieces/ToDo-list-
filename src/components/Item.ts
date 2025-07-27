// Класс для создания элемента списка
export class Item {
    // Элемент списка дел
    protected itemElement: HTMLElement;

    // Заголовок списка дел
    protected title: HTMLElement;

    // Принимает шаблон элемента списка дел.
    // Устанавливает значения элемента списка и заголовка
    constructor(template: HTMLTemplateElement) {
        this.itemElement = template.content.querySelector(".todo-item").cloneNode(true) as HTMLElement;
        this.title = this.itemElement.querySelector(".todo-item__text");
    }

    // Принимает строку.
    // Устанавливает строку как заголовок элемента.
    // Возвращает элемент
    render(item: string): HTMLElement {
        this.title.textContent = item;
        return this.itemElement;
    }
}
