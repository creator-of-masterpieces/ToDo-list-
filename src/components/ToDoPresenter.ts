import {IForm, IFormConstructor} from "./Form";
import {IToDoModel} from "../types";
import {IPage} from "./Page";
import {IViewitemConstructor} from "./Item";

// Класс-презентер отвечает за взаимодействие модели данных и визуального интерфейса.
// Он координирует логику: создает формы, обрабатывает события и обновляет отображение.
export class ItemPresenter {
    // Шаблон элемента задачи
    protected itemTemplate: HTMLTemplateElement;
    // Шаблон формы
    protected formTemplate: HTMLTemplateElement;
    // Экземпляр формы добавления задачи
    protected todoForm: IForm;
    // Экземпляр формы редактирования задачи (в текущей реализации не используется)
    protected todoEditForm: IForm;

    constructor(
        // Интерфейс модели данных
        protected model: IToDoModel,
        // Интерфейс конструктора формы, будет использоваться для создания новых форм
        protected formConstructor: IFormConstructor,
        // Интерфейс класса для управления отображением страницы
        protected viewPageContainer: IPage,
        // Интерфейс конструктора элемента списка дел
        protected viewItemConstructor: IViewitemConstructor,
    ) {
        // Получаем шаблон элемента списка задач из разметки
        this.itemTemplate = document.querySelector('#todo-item-template') as HTMLTemplateElement;
        // Получаем шаблон формы добавления задачи из разметки
        this.formTemplate = document.querySelector('#todo-form-template') as HTMLTemplateElement;
    }
    init() {
        // Создает экземпляр формы
        this.todoForm = new this.formConstructor(this.formTemplate);
        // Устанавливает обработчик события отправки для формы
        this.todoForm.setHandler(this.handleSubmitForm.bind(this));
        // Создает разметку формы и сохраняет её в контейнер страницы
        this.viewPageContainer.formContainer = this.todoEditForm.render();
    }

    // Обработчик события отправки формы.
    // Принимает название дела (строку)
    handleSubmitForm(data: string) {
        // Создает объект нового дела, добавляет его в массив дел
        this.model.addItem(data);
        // Перерисовывает интерфейс (обновляет список задач)
        this.renderView();
        // Очищает поля формы после добавления задачи
        this.todoForm.clearValue();
    }

    // Отрисовывает список дел
    renderView() {
        // Преобразует каждый элемент из модели в визуальный HTML-элемент
        const itemList = this.model.items.map((item)=> {
            // создаём визуальный элемент задачи
            const todoItem = new this.viewItemConstructor(this.itemTemplate);
            // создаём DOM-элемент
            const itemElement = todoItem.render(item);
            return itemElement;
        }).reverse(); // инвертируем список, чтобы новые задачи отображались выше

        // Устанавливаем новый список задач в контейнер представления страницы
        this.viewPageContainer.todoContainer = itemList;
    }
}