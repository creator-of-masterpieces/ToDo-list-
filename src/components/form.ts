// Класс для управления формой.
// Содержит элемент формы, поле формы, обработчик сабмита.
export class Form {
    protected formElement: HTMLFormElement;
    protected inputField: HTMLInputElement;

    // Записывает элемент формы и поле формы,
    // устанавливает на форму слушатель отправки.
    // Передает в обработчик отправки значение поля формы
    constructor(formElement: HTMLFormElement, protected handleFormSubmit: Function) {
        this.formElement = formElement;
        this.inputField = this.formElement.querySelector('.todo-form__input');
        this.formElement.addEventListener('submit', (evt) => {
            evt.preventDefault();
            this.handleFormSubmit(this.inputField.value);
        })
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
}