import {IForm, IFormConstructor} from "./Form";
import {IToDoModel} from "../types";
import {IPage} from "./Page";
import {IViewItem, IViewItemConstructor} from "./Item";
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

    protected handleSubmitEditForm: (data: {value: string}) => void;

    constructor(
        // Интерфейс модели данных
        protected model: IToDoModel,
        // Интерфейс конструктора формы. Будет использоваться для создания новых форм.
        protected formConstructor: IFormConstructor,
        // Интерфейс класса для управления отображением страницы
        protected viewPageContainer: IPage,
        // Интерфейс конструктора элемента списка дел
        protected viewItemConstructor: IViewItemConstructor,
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
     *    - обработчик отправки (`handleSubmitForm`);
     *    - текст кнопки ("Добавить");
     *    - плейсхолдер поля ("Следующее дело");
     *    - и рендерит её в контейнер страницы (`viewPageContainer.formContainer`).
     * 2) Создаёт экземпляр формы редактирования дела (`todoEditForm`), задаёт:
     *    - текст кнопки ("Изменить");
     *    - плейсхолдер ("Новое название").
     *    Форма редактирования не рендерится сразу, она показывается в модальном окне при редактировании.
     *  При возникновении события changed, перерисовывает страницу.
     */
    init() {
        this.todoForm = new this.formConstructor(this.formTemplate);
        this.todoForm.buttonText = 'Добавить';
        this.todoForm.placeholder = 'Следующее дело';
        this.viewPageContainer.formContainer = this.todoForm.render();

        this.todoEditForm = new this.formConstructor(this.formTemplate);
        this.todoEditForm.buttonText = 'Изменить';
        this.todoEditForm.placeholder = 'Новое название';

        this.model.on('changed', ()=> {
            this.renderView();
        })

        this.todoForm.on('submit', this.handleSubmitForm.bind(this));
        this.todoEditForm.on('submit', (data: {value: string}) => this.handleSubmitForm(data));
    }

    /**
     * Обрабатывает отправку формы добавления задачи
     * @param data — текст новой задачи
     *
     * 1) Добавляет новую задачу в модель (`this.model.addItem(data)`).
     *    Модель сама генерирует событие `changed`, на которое презентер подписан в `init()`,
     *    поэтому перерисовка списка происходит реактивно вне этого метода.
     * 2) Очищает поле формы (`this.todoForm.clearValue()`), чтобы подготовить её к следующему вводу.
     *
     * Примечание: метод не вызывает `renderView()` напрямую — обновление интерфейса
     * выполняется обработчиком события `changed`, установленным в `init()`.
     */
    handleSubmitForm(data: {value: string}) {
        this.model.addItem(data.value);
        this.todoForm.clearValue();
    }

    /**
     * Обрабатывает копирование задачи
     * @param item — визуальный элемент задачи (IViewItem), по которому кликнули "Копировать"
     *
     * 1) Берёт данные исходной задачи (`model.getItem(item.id)`).
     * 2) Создаёт новую задачу с тем же названием (`model.addItem(...)`), id генерируется автоматически.
     * 3) Перерисовывает список (`renderView()`), чтобы показать дубликат.
     */
    handleCopyItem(item: {id: string}) {
        const copyEdItem = this.model.getItem(item.id);
        this.model.addItem(copyEdItem.name);
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
    handleDeleteItem(item: {id: string}) {
        this.model.removeItem(item.id);
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
     * Связка: setEditHandler → handleEditItem → handleSubmitEditForm.
     */
    handleEditItem(item: {id: string}) {
        const editItem = this.model.getItem(item.id);
        this.todoEditForm.setValue(editItem.name);
        this.modal.content = this.todoEditForm.render();
        this.handleSubmitEditForm = (data: {value: string})=> {
            this.model.editItem(item.id, data.value);
            this.todoForm.clearValue();
            this.modal.close();
        };
        this.modal.open();
    }

    /**
     * Отрисовывает актуальный список задач на странице
     *
     * 1) Берёт массив задач из модели (`this.model.items`).
     * 2) Для каждой задачи:
     *    - создаёт визуальный элемент (`IViewItem`) по шаблону `itemTemplate`;
     *    - навешивает обработчики:
     *        • копирования (`setCopyHandler(this.handleCopyItem.bind(this))`);
     *        • удаления (`setDeleteHandler(this.handleDeleteItem.bind(this))`);
     *        • редактирования (`setEditHandler(this.handleEditItem.bind(this))`);
     *    - рендерит DOM-узел (`render(item)`) и возвращает его.
     * 3) Инвертирует порядок элементов `.reverse()`, чтобы новые задачи были сверху.
     * 4) Передаёт массив DOM-элементов представлению (`viewPageContainer.todoContainer`),
     *    тем самым обновляя список на странице.
     *
     * Вызывается после добавления, редактирования, копирования и удаления,
     * чтобы синхронизировать UI с состоянием модели.
     */
    renderView() {
        const itemList = this.model.items.map((item) => {
            const todoItem = new this.viewItemConstructor(this.itemTemplate);
            todoItem.on('copy', this.handleCopyItem.bind(this));
            todoItem.on('delete', this.handleDeleteItem.bind(this));
            todoItem.on('edit', this.handleEditItem.bind(this));
            const itemElement = todoItem.render(item);
            return itemElement;
        }).reverse();
        this.viewPageContainer.todoContainer = itemList;
    }
}