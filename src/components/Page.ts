/**
 * Компонент `Page` — отвечает за работу с основной разметкой страницы.
 * Слой: View.
 *
 * Взаимодействие:
 * - управляет контейнером формы (вставка/очистка);
 * - управляет контейнером списка задач (перерисовка карточек);
 * - сам не хранит данные и не реализует бизнес-логику; — только обновляет DOM.
 */

/**
 * Интерфейс IPage — контракт страницы.
 * Определяет два свойства:
 * - `formContainer`; — контейнер для формы (HTMLElement)
 * - `todoContainer`; — массив HTML-элементов задач
 */
export interface IPage {
    formContainer: HTMLElement;
    todoContainer: HTMLElement[];
}

/**
 * Класс `Page` реализует интерфейс IPage.
 * Отвечает за:
 * - поиск и сохранение ссылок на контейнеры формы и списка задач;
 * - обновление содержимого этих контейнеров по запросу презентера.
 */
export class Page implements IPage {
    // Контейнер для формы
    _formContainer: HTMLElement;
    // Контейнер для списка задач
    _todoContainer: HTMLElement;

    /**
     * @param container — корневой DOM-элемент страницы
     *
     * Конструктор ищет внутри:
     * - контейнер для формы `.todo-form-container`;
     * - контейнер для списка задач `.todos__list`.
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
     * Сеттер для контейнера формы.
     * @param formElement — HTML-форма или null
     *
     * Поведение:
     * - если передана форма; — вставляет её внутрь контейнера;
     * - если передан `null`; — очищает контейнер.
     *
     * Это удобно, например, чтобы временно скрыть форму или заменить её другой.
     */
    set formContainer(formElement: HTMLFormElement | null) {
        if (formElement) {
            this._formContainer.replaceChildren(formElement);
        } else {
            this._formContainer.innerHTML = '';
        }
    }

}