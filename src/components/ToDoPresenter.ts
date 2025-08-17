import {IForm, IFormConstructor} from "./Form";
import {IToDoModel} from "../types";
import {IPage} from "./Page";
import {IViewItem, IViewItemConstructor} from "./Item";
import {IPopup} from "./Popup";

/**
 * Класс `ItemPresenter` — центральный элемент архитектуры MVP (Presenter).
 *
 * Отвечает за:
 * - взаимодействие между Model (данные) и View (страница, формы, элементы задач);
 * - настройку и рендеринг форм;
 * - обработку событий пользователя (добавить, удалить, копировать, редактировать задачу);
 * - обновление интерфейса при изменении данных в модели.
 */
export class ItemPresenter {
    // Шаблон элемента задачи (HTML <template>)
    protected itemTemplate: HTMLTemplateElement;
    // Шаблон формы
    protected formTemplate: HTMLTemplateElement;
    // Экземпляр формы добавления задачи
    protected todoForm: IForm;
    // Экземпляр формы редактирования задачи
    protected todoEditForm: IForm;

    // Обработчик отправки формы редактирования
    protected handleSubmitEditForm: (data: {value: string}) => void;

    constructor(
        // Интерфейс модели данных
        protected model: IToDoModel,
        // Интерфейс конструктора формы. Будет использоваться для создания новых форм.
        protected formConstructor: IFormConstructor,
        // Интерфейс класса для управления отображением страницы (контейнер для формы и списка)
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
     * Инициализация приложения.
     *
     * - Создаёт форму добавления задачи (`todoForm`) с текстом кнопки "Добавить" и плейсхолдером "Следующее дело".
     *   Рендерит её в контейнер страницы.
     * - Создаёт форму редактирования задачи (`todoEditForm`) с текстом кнопки "Изменить" и плейсхолдером "Новое название".
     *   Она не отображается сразу, а используется в модальном окне.
     * - Подписывается на событие `changed` модели, чтобы при каждом изменении перерисовывать список задач.
     * - Подписывается на событие `submit` обеих форм.
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
        this.todoEditForm.on('submit', (data: {value: string}) => this.handleSubmitEditForm(data));
    }

    /**
     * Обработка отправки формы добавления задачи.
     * @param data — объект вида {value: string}
     *
     * 1) Добавляет новую задачу в модель;
     * 2) Модель эмитит событие `changed`, которое автоматически вызывает `renderView()`;
     * 3) Очищает поле формы.
     */
    handleSubmitForm(data: {value: string}) {
        this.model.addItem(data.value);
        this.todoForm.clearValue();
    }

    /**
     * Обработка копирования задачи.
     * @param item — объект с id задачи
     *
     * Создаёт новую задачу с тем же названием, но с новым id.
     */
    handleCopyItem(item: {id: string}) {
        const copyEdItem = this.model.getItem(item.id);
        this.model.addItem(copyEdItem.name);
    }

    /**
     * Обработка удаления задачи.
     * @param item — объект с id задачи
     *
     * Удаляет задачу из модели.
     */
    handleDeleteItem(item: {id: string}) {
        this.model.removeItem(item.id);
    }

    /**
     * Обработка редактирования задачи.
     * @param item — объект с id задачи
     *
     * - Получает задачу из модели;
     * - Заполняет форму редактирования текущим названием;
     * - Вставляет форму в модальное окно;
     * - Устанавливает обработчик сохранения изменений;
     * - Открывает модальное окно.
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
     *    - Рендерит DOM-узлы и собирает их в массив.
     * 3) Инвертирует порядок элементов `.reverse()`, чтобы новые задачи были сверху.
     * 4) Передаёт массив элементов контейнеру страницы,
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