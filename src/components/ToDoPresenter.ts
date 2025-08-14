import {IForm, IFormConstructor} from "./Form";
import {IToDoModel} from "../types";
import {IPage} from "./Page";
import {IViewItem, IViewitemConstructor} from "./Item";

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
        this.viewPageContainer.formContainer = this.todoForm.render();
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

    /**
     * Обрабатывает копирование задачи
     * @param item — экземпляр визуального элемента задачи (IViewItem),
     *               у которого была нажата кнопка копирования
     *
     * 1. Получает полные данные задачи из модели по её id с помощью метода `getItem`.
     *    Это позволяет скопировать не только текст, но и сохранить корректную структуру данных.
     * 2. Добавляет в модель новую задачу с тем же названием (`name`), что и у исходной.
     *    Новый объект получает уникальный id, который генерируется в `addItem`.
     * 3. Вызывает `renderView()` для перерисовки списка дел, чтобы новый элемент сразу
     *    отобразился на странице.
     *
     * Этот метод используется в связке с `setCopyHandler` из класса Item:
     * при клике по кнопке копирования он получает текущий элемент, дублирует его в модели
     * и обновляет интерфейс.
     */
    handleCopyitem(item: IViewItem) {
        const copyeditem = this.model.getItem(item.id);
        this.model.addItem(copyeditem.name);
        this.renderView()
    }

    /**
     * Отрисовывает актуальный список задач на странице
     *
     * 1. Получает массив задач из модели (`this.model.items`).
     * 2. Преобразует каждую задачу в готовый HTML-элемент:
     *    - Создаёт экземпляр визуального элемента (`IViewItem`) с использованием шаблона `itemTemplate`.
     *    - Устанавливает обработчик копирования с помощью `setCopyHandler`, чтобы каждая задача
     *      могла быть скопирована при клике по соответствующей кнопке.
     *    - Вызывает метод `render(item)`, который создаёт DOM-элемент на основе данных задачи (`id`, `name`).
     *    - Возвращает готовый DOM-элемент.
     * 3. Применяет `.reverse()` для инверсии массива, чтобы новые задачи отображались вверху списка.
     * 4. Передаёт массив готовых DOM-элементов в представление (`this.viewPageContainer.todoContainer`),
     *    заменяя старое содержимое списка на новое.
     *
     * Этот метод вызывается после добавления, копирования или удаления задач, чтобы синхронизировать
     * интерфейс с актуальным состоянием модели данных.
     */
    renderView() {
        const itemList = this.model.items.map((item)=> {
            const todoItem = new this.viewItemConstructor(this.itemTemplate);
            todoItem.setCopyHandler(this.handleCopyitem.bind(this))
            const itemElement = todoItem.render(item);
            return itemElement;
        }).reverse();
        this.viewPageContainer.todoContainer = itemList;
    }
}