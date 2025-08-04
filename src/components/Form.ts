export interface IForm {
    buttonText: string;
    placeholder: string;
    setHandler(handleFormSubmit: Function): void;
    render(): HTMLFormElement;
    setValue(data: string): void;
    getValue(): string;
    clearValue(): void;
}

export interface IFormConstructor {
    new (formTemplate: HTMLTemplateElement): IForm;
}


// Класс для управления формой.
// Содержит элемент формы, поле формы, обработчик сабмита.
export class Form implements IForm  {
    protected formElement: HTMLFormElement;
    protected inputField: HTMLInputElement;
    protected handleFormSubmit: Function;
    protected submitButton: HTMLButtonElement;

    // Принимает темплейт с формой.
    // Ищет в темплейте форму, клонирует её в свойство.
    // В форме ищет поле ввода и кнопку отправки, записывает их в свойства.
    // Устанавливает на форму слушатель отправки.
    // Передает в обработчик отправки значение поля формы
    constructor(formElement: HTMLTemplateElement) {
        this.formElement = formElement.content
            .querySelector('.todo-form')
            .cloneNode(true) as HTMLFormElement;

        // Поле ввода
        this.inputField = this.formElement.querySelector('.todo-form__input');

        // Кнопка отправки
        this.submitButton = this.formElement.querySelector('.todo-form__submit-btn');

        // Слушатель отправки
        this.formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.handleFormSubmit(this.inputField.value);
        })
    }

    // Принимает и устанавливает обработчик отправки формы.
    setHandler(handleFormSubmit: Function) {
        this.handleFormSubmit = handleFormSubmit;
    }

    // Возвращает элемент формы
    render() {
        return this.formElement;
    }

    // Принимает строку.
    // Устанавливает строку в значение поля.
    setValue(data: string) {
        this.inputField.value = data;
    }

    // Возвращает значение поля
    getValue() {
        return this.inputField.value;
    }

    // Очищает поля формы
    clearValue() {
        this.formElement.reset();
    }

    set buttonText(data: string) {
        this.submitButton.textContent = data;
    }

    set placeholder(data: string) {
        this.inputField.placeholder = data;
    }
}