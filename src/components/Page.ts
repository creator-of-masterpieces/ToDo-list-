// Класс для управления разметкой основного содержимого страницы

// Интерфейс страницы:
// Определяет два свойства:
// - formContainer — контейнер для формы (HTMLElement)
// - todoContainer — массив HTML-элементов задач
export interface IPage {
    formContainer: HTMLElement;
    todoContainer: HTMLElement[];
}

// Класс Page реализует интерфейс IPage и управляет структурой страницы:
// - вставляет форму
// - обновляет список задач
export class Page implements IPage {
    _formContainer: HTMLElement;
    _todoContainer: HTMLElement;

    /**
     * Конструктор принимает корневой DOM-элемент страницы
     * Ищет внутри него:
     * - контейнер для формы `.todo-form-container`
     * - контейнер для списка задач `.todos__list`
     */
    constructor(protected container: HTMLElement) {
        this._formContainer = this.container.querySelector('.todo-form-container');
        this._todoContainer = this.container.querySelector('.todos__list');
    }

    /**
     * Устанавливает содержимое контейнера задач
     * @param items — массив HTML-элементов, представляющих задачи
     *
     * Метод `replaceChildren`:
     * - удаляет текущее содержимое контейнера
     * - добавляет все переданные элементы (используется оператор spread `...`)
     */
    set todoContainer(items: HTMLElement[]) {
        this._todoContainer.replaceChildren(...items);
    }

    /**
     * Устанавливает содержимое контейнера формы
     * @param formElement — HTML-форма или null
     *
     * Если форма передана — вставляется в контейнер.
     * Если передано `null` — контейнер очищается.
     * Это удобно, если, например, нужно скрыть форму.
     */
    set formContainer(formElement: HTMLFormElement | null) {
        if (formElement) {
            this._formContainer.replaceChildren(formElement);
        } else {
            this._formContainer.innerHTML = '';
        }
    }

}