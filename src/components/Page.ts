// Класс для управления разметкой основного содержимого станицы

// Экземпляр класса должен содержать контейнер для формы и список дел
export interface IPage {
    formContainer: HTMLElement;
    todoContainer: HTMLElement[];
}

export class Page implements IPage {
    _formContainer: HTMLElement;
    _todoContainer: HTMLElement;

    // Принимает элемент разметки.
    // Ищет в принятом элементе контейнер для формы и список дел.
    // Записывает их в свойства.
    constructor(protected container: HTMLElement) {
        this._formContainer = this.container.querySelector('.todo-form-container');
        this._todoContainer = this.container.querySelector('.todos__list');
    }

    // Принимает массив элементов списка.
    // Заменяет всё содержимое списка на эти элементы.
    // Метод replaceChildren очищает всё текущее содержимое элемента,
    // добавляет новые дочерние узлы (элементы, текст и т.д.).
    // Spread оператор (...) распаковывает массив на отдельные элементы
    set todoContainer(items: HTMLElement[]) {
        this._todoContainer.replaceChildren(...items);
    }

    // Принимает элемент формы или null;
    // null может быть в том случае, если формы в контейнере нет (переход на другую страницу, закрытие формы и т.д.).
    // Если форма есть — вставляет её внутрь контейнера.
    // Если формы нет — очищает содержимое контейнера.
    set formContainer(formElement: HTMLFormElement | null) {
        if (formElement) {
            this._formContainer.replaceChildren(formElement);
        } else {
            this._formContainer.innerHTML = '';
        }
    }

}