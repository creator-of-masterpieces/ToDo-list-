import {IForm, IFormConstructor} from "./Form";
import {IToDoModel} from "../types";
import {IPage} from "./Page";
import {IViewItem, IViewitemConstructor} from "./Item";
import {IPopup} from "./Popup";

// Класс-презентер отвечает за взаимодействие модели данных и визуального интерфейса.
// Он координирует логику: создает формы, обрабатывает события и обновляет отображение.
export class ItemPresenter {
    // Шаблон элемента задачи
    protected itemTemplate: HTMLTemplateElement;
    // Шаблон формы
    protected formTemplate: HTMLTemplateElement;
    // Экземпляр формы добавления задачи
    protected todoForm: IForm;
    // Экземпляр формы редактирования задачи
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
        // Интерфейс модального окна
        protected modal: IPopup,
    ) {
        // Получаем шаблон элемента списка задач из разметки
        this.itemTemplate = document.querySelector('#todo-item-template') as HTMLTemplateElement;
        // Получаем шаблон формы добавления задачи из разметки
        this.formTemplate = document.querySelector('#todo-form-template') as HTMLTemplateElement;
    }

    /**
     * Инициализирует формы и размещает форму добавления на странице
     *
     * 1) Создаёт экземпляр формы добавления дела (`todoForm`), задаёт:
     *    - обработчик отправки (`handleSubmitForm`),
     *    - текст кнопки ("Добавить"),
     *    - плейсхолдер поля ("Следующее дело"),
     *    - и рендерит её в контейнер страницы (`viewPageContainer.formContainer`).
     * 2) Создаёт экземпляр формы редактирования дела (`todoEditForm`), задаёт:
     *    - текст кнопки ("Изменить"),
     *    - плейсхолдер ("Новое название").
     *    Форма редактирования не рендерится сразу, она показывается в модальном окне при редактировании.
     */
    init() {
        this.todoForm = new this.formConstructor(this.formTemplate);
        this.todoForm.setHandler(this.handleSubmitForm.bind(this));
        this.todoForm.buttonText = 'Добавить';
        this.todoForm.placeholder = 'Следующее дело';
        this.viewPageContainer.formContainer = this.todoForm.render();

        this.todoEditForm = new this.formConstructor(this.formTemplate);
        this.todoEditForm.buttonText = 'Изменить';
        this.todoEditForm.placeholder = 'Новое название';
    }

    /**
     * Обрабатывает отправку формы редактирования задачи
     * @param data — новое название задачи
     * @param id — идентификатор редактируемой задачи
     *
     * 1) Обновляет элемент в модели через `this.model.editItem(id, data)`.
     * 2) Перерисовывает список задач вызовом `renderView()`.
     * 3) Очищает поле формы редактирования (`todoEditForm.clearValue()`),
     * 4) Закрывает модальное окно (`modal.close()`).
     *
     * Вызывается обработчиком формы, установленным динамически в момент открытия модального окна.
     */
    handleSubmitForm(data: string) {
        this.model.addItem(data);
        this.renderView();
        this.todoForm.clearValue();
    }

    /**
     * Обрабатывает отправку формы редактирования задачи
     * @param data — новое название задачи (строка)
     * @param id — идентификатор редактируемой задачи
     *
     * 1. Вызывает метод `editItem` модели (`this.model`), передавая в него `id` и новое название.
     *    Это обновляет соответствующий объект в массиве `_items`.
     * 2. Вызывает `renderView()`, чтобы перерисовать список задач и отобразить изменения в интерфейсе.
     * 3. Очищает поле формы редактирования, вызывая `clearValue()` у `todoEditForm`.
     * 4. Закрывает модальное окно с формой редактирования, вызывая `close()` у объекта `modal`.
     *
     * Метод используется при подтверждении изменений названия задачи
     * в модальном окне редактирования.
     */
    handleSubmitEditForm(data: string, id: string) {
        this.model.editItem(id, data);
        this.renderView();
        this.todoEditForm.clearValue();
        this.modal.close();
    }

    /**
     * Обрабатывает копирование задачи
     * @param item — визуальный элемент задачи (IViewItem), по которому кликнули "Копировать"
     *
     * 1) Берёт данные исходной задачи (`model.getItem(item.id)`).
     * 2) Создаёт новую задачу с тем же названием (`model.addItem(...)`), id генерируется автоматически.
     * 3) Перерисовывает список (`renderView()`), чтобы показать дубликат.
     */
    handleCopyItem(item: IViewItem) {
        const copyeditem = this.model.getItem(item.id);
        this.model.addItem(copyeditem.name);
        this.renderView()
    }

    /**
     * Обрабатывает удаление задачи
     * @param item — визуальный элемент задачи (IViewItem), по которому кликнули "Удалить"
     *
     * 1) Удаляет задачу из модели по `id` (`model.removeItem(item.id)`).
     * 2) Перерисовывает список (`renderView()`), чтобы отразить изменения.
     *
     * Используется совместно с `setDeleteHandler` у элемента задачи.
     */
    handleDeleteItem(item: IViewItem) {
        this.model.removeItem(item.id);
        this.renderView();
    }

    /**
     * Открывает модальное окно редактирования для выбранной задачи
     * @param item — визуальный элемент задачи (IViewItem), по которому кликнули "Редактировать"
     *
     * 1) Получает актуальные данные задачи из модели (`getItem(item.id)`).
     * 2) Заполняет форму редактирования текущим названием (`todoEditForm.setValue(...)`),
     *    чтобы пользователь редактировал существующее значение.
     * 3) Рендерит форму в модальное окно (`modal.content = todoEditForm.render()`).
     * 4) Устанавливает обработчик сабмита формы редактирования:
     *    при отправке вызовет `handleSubmitEditForm(newTitle, item.id)`.
     * 5) Открывает модальное окно (`modal.open()`).
     *
     * Связка: setEditHandler → hendleEditItem → handleSubmitEditForm.
     */
    handleEditItem(item: IViewItem) {
        const editItem = this.model.getItem(item.id);
        this.todoEditForm.setValue(editItem.name);
        this.modal.content = this.todoEditForm.render();
        this.todoEditForm.setHandler((data: string) => this.handleSubmitEditForm(data, item.id));
        this.modal.open();
    }

    /**
     * Отрисовывает актуальный список задач на странице
     *
     * 1) Берёт массив задач из модели (`this.model.items`).
     * 2) Для каждой задачи:
     *    - создаёт визуальный элемент (`IViewItem`) по шаблону `itemTemplate`,
     *    - навешивает обработчики:
     *        • копирования (`setCopyHandler(this.handleCopyItem.bind(this))`),
     *        • удаления   (`setDeleteHandler(this.handleDeleteItem.bind(this))`),
     *        • редактирования (`setEditHandler(this.hendleEditItem.bind(this))`),
     *    - рендерит DOM-узел (`render(item)`) и возвращает его.
     * 3) Инвертирует порядок элементов `.reverse()`, чтобы новые задачи были сверху.
     * 4) Передаёт массив DOM-элементов представлению (`viewPageContainer.todoContainer`),
     *    тем самым обновляя список на странице.
     *
     * Вызывается после добавления, редактирования, копирования и удаления,
     * чтобы синхронизировать UI с состоянием модели.
     */
    renderView() {
        const itemList = this.model.items.map((item)=> {
            const todoItem = new this.viewItemConstructor(this.itemTemplate);
            todoItem.setCopyHandler(this.handleCopyItem.bind(this));
            todoItem.setDeleteHandler(this.handleDeleteItem.bind(this));
            todoItem.setEditHandler(this.handleEditItem.bind(this));
            const itemElement = todoItem.render(item);
            return itemElement;
        }).reverse();
        this.viewPageContainer.todoContainer = itemList;
    }
}