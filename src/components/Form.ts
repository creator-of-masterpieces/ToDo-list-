/**
 * Компонент формы (Form) — отвечает за ввод текста задачи, локальную валидацию и проброс намерений наружу.
 * Слой: View.
 *
 * Взаимодействие:
 * - внешний код предоставляет обработчик отправки (через setHandler); — Form вызывает его с текущим значением поля;
 * - внешний код управляет видом формы (текст кнопки, placeholder) через сеттеры;
 * - сам компонент не знает о модели и бизнес-логике; — он только собирает ввод пользователя и сообщает о нём.
 */

import {EventEmitter, IEvents} from "./EventEmitter";

/**
 * Публичный контракт компонента формы.
 * Наследуемся от IEvents, чтобы поддерживать единый стиль подписок/эмитов в проекте.
 *
 * Свойства/методы:
 * - `buttonText` (setter); — управляет текстом кнопки отправки;
 * - `placeholder` (setter); — управляет плейсхолдером текстового поля;
 * - `render()`; — возвращает корневой DOM-элемент формы (готовый к вставке в документ);
 * - `setValue/getValue/clearValue()`; — управление текущим значением поля ввода.
 */
export interface IForm extends IEvents {
    buttonText: string;
    placeholder: string;
    render(): HTMLFormElement;
    setValue(data: string): void;
    getValue(): string;
    clearValue(): void;
}

/**
 * Контракт «конструктора формы»; — позволяет передавать класс формы как зависимость.
 * Нужен презентеру, чтобы создавать экземпляры формы, не зная конкретной реализации.
 */
export interface IFormConstructor {
    new (formTemplate: HTMLTemplateElement): IForm;
}


/**
 * UI-компонент формы.
 * Отвечает за:
 * - инициализацию DOM-элементов и обработчиков;
 * - сбор значения из текстового поля;
 * - проброс события «отправить» во внешний обработчик (переданный через setHandler).
 *
 * Не делает:
 * - манипуляций с моделью/данными; — только View;
 * - собственных побочных эффектов вне DOM (сетевых запросов и т.п.).
 */
export class Form extends EventEmitter implements IForm  {
    // Корневой элемент формы — результат рендера/клонирования шаблона
    protected formElement: HTMLFormElement;
    // Поле ввода для текста задачи
    protected inputField: HTMLInputElement;
    // Кнопка отправки формы
    protected submitButton: HTMLButtonElement;

    /**
     * @param formTemplate HTMLTemplateElement; — источник разметки формы (клон вставляется в DOM).
     * @remarks Конструктор не монтирует элемент в документ; — это делает внешний код.
     */
    constructor(formTemplate: HTMLTemplateElement) {
        super();
        // Клонируем содержимое шаблона — получаем независимый узел формы
        this.formElement = formTemplate.content
            .querySelector('.todos__form')
            .cloneNode(true) as HTMLFormElement;

        // Кэшируем часто используемые элементы интерфейса
        // Поле ввода
        this.inputField = this.formElement.querySelector('.todo-form__input');
        // Кнопка отправки
        this.submitButton = this.formElement.querySelector('.todo-form__submit-btn');

        // Навешиваем обработчик submit — предотвращаем дефолт и вызываем внешний колбэк (если задан)
        this.formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.emit('submit', {value: this.inputField.value});
        })
    }

    /**
     * Возвращает готовый DOM-элемент формы для монтирования в документ.
     * Обработчик submit уже навешан в конструкторе.
     */
    render() {
        return this.formElement;
    }

    //Устанавливает значение в поле ввода
    setValue(data: string) {
        this.inputField.value = data;
    }

    // Получает текущее значение из поля ввода
    getValue() {
        return this.inputField.value;
    }

    // Очищает поля формы (в том числе поле ввода)
    clearValue() {
        this.formElement.reset();
    }

    // Устанавливает текст кнопки отправки
    set buttonText(data: string) {
        this.submitButton.textContent = data;
    }

    // Устанавливает placeholder для поля ввода
    set placeholder(data: string) {
        this.inputField.placeholder = data;
    }
}