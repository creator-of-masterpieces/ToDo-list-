// Интерфейс для управления модальным окном (попапом)
export interface IPopup {
    // Элемент с содержимым попапа
    content: HTMLElement;
    // Метод открытия попапа
    open(): void;
    // Метод закрытия попапа
    close(): void;
}

/**
 * Класс Popup реализует базовую логику управления модальным окном:
 * - отображение и скрытие окна;
 * - установка содержимого;
 * - обработка кликов для закрытия.
 */
export class Popup implements IPopup {
    // Кнопка закрытия попапа
    protected closeButton: HTMLButtonElement;
    // Контейнер с содержимым попапа
    protected _content: HTMLElement;

    /**
     * @param container — корневой HTML-элемент попапа
     *
     * В конструкторе:
     * 1. Находит и сохраняет кнопку закрытия (`.popup__close`).
     * 2. Находит и сохраняет контейнер содержимого (`.popup__content`).
     * 3. Устанавливает обработчики событий:
     *    - клик по кнопке закрытия → закрывает попап;
     *    - клик по фону попапа → закрывает попап;
     *    - клик по содержимому попапа → останавливает всплытие события, чтобы окно не закрылось.
     */
    constructor(protected container: HTMLElement) {
        this.closeButton = container.querySelector('.popup__close');
        this._content = container.querySelector('.popup__content');

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    /**
     * Устанавливает новое содержимое попапа.
     * @param value — DOM-элемент, который будет вставлен внутрь `.popup__content`
     *
     * Перед вставкой старое содержимое полностью удаляется (`replaceChildren`).
     */
    set content (value: HTMLElement) {
        this.content.replaceChildren(value);
    }

    /**
     * Открывает попап:
     * - добавляет CSS-класс `popup_is-opened` к контейнеру.
     * - делает его видимым.
     */
    open() {
        this.container.classList.add('popup_is-opened');
    }

    /**
     * Закрывает попап:
     * - удаляет CSS-класс `popup_is-opened` с контейнера.
     * - очищает содержимое, устанавливая `null` (контент удаляется из DOM).
     */
    close() {
        this.container.classList.remove('popup_is-opened');
        this.content = null;
    }
}
