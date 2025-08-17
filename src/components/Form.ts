// Интерфейс формы.
// Определяет свойства и методы, которые должен реализовать класс формы:
// - `buttonText` и `placeholder` — устанавливают текст кнопки и плейсхолдер поля
// - `setHandler` — принимает функцию-обработчик отправки формы
// - `render` — возвращает DOM-элемент формы
// - `setValue`, `getValue`, `clearValue` — управление значением поля ввода
import {EventEmitter, IEvents} from "./EventEmitter";

export interface IForm extends IEvents {
    buttonText: string;
    placeholder: string;
    render(): HTMLFormElement;
    setValue(data: string): void;
    getValue(): string;
    clearValue(): void;
}

// Интерфейс конструктора формы.
// Указывает, что форма создаётся через конструктор с шаблоном (template) формы.
export interface IFormConstructor {
    new (formTemplate: HTMLTemplateElement): IForm;
}


// Класс для управления формой добавления задач.
// Реализует интерфейс IForm.
// Управляет DOM-элементами формы, обработкой отправки, значением поля ввода и т.д.
export class Form extends EventEmitter implements IForm  {
    protected formElement: HTMLFormElement;
    protected inputField: HTMLInputElement;
    protected submitButton: HTMLButtonElement;

    /**
     * Конструктор формы.
     * @param formTemplate - HTML-шаблон, содержащий структуру формы
     *
     * Из шаблона клонируется DOM-элемент формы.
     * Находит в форме поле ввода и кнопку отправки.
     * Устанавливает обработчик события submit.
     */
    constructor(formTemplate: HTMLTemplateElement) {
        super();
        this.formElement = formTemplate.content
            .querySelector('.todos__form')
            .cloneNode(true) as HTMLFormElement;

        // Поле ввода
        this.inputField = this.formElement.querySelector('.todo-form__input');
        // Кнопка отправки
        this.submitButton = this.formElement.querySelector('.todo-form__submit-btn');
        // Устанавливаем слушатель события отправки формы
        this.formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.emit('submit', {value: this.inputField.value});
        })
    }

    // Возвращает DOM-элемент формы
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