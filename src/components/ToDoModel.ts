import {IItem, IToDoModel} from "../types";
import {EventEmitter} from "./EventEmitter";

/**
 * Класс `ToDoModel` — слой Model в архитектуре MVP.
 * Отвечает за хранение и управление списком задач (to-do).
 *
 * Основные обязанности:
 * - хранит массив задач в памяти;
 * - добавляет, удаляет и редактирует задачи;
 * - генерирует события (`changed`) при каждом изменении, чтобы View обновлялся.
 */
export class ToDoModel extends EventEmitter implements IToDoModel {
    // Приватное хранилище задач — массив объектов вида {id, name}
    protected _items: IItem[];

    /** Конструктор инициализирует пустой список задач */
    constructor() {
        super();
        this._items = [];
    }

    /**
     * Сеттер списка задач.
     * @param data — массив объектов `IItem`.
     *
     * Полностью заменяет текущее содержимое массива `_items`.
     * После обновления эмитит событие `changed`.
     */
    set items(data: IItem[]) {
        this._items = data;
        this.emit('changed');
    }

    /**
     * Геттер списка задач.
     * Возвращает текущий массив задач
     */
    get items() {
        return this._items;
    }

    /**
     * Добавляет новую задачу.
     * @param data — текст новой задачи
     *
     * Алгоритм:
     * 1. Считает максимальный существующий id (числовое значение);
     * 2. Генерирует новый id как `max + 1`;
     * 3. Создаёт объект `IItem` с новым id и переданным `name`;
     * 4. Добавляет задачу в массив и эмитит событие `changed`.
     *
     * @returns созданный объект задачи `{id, name}`.
     */
    addItem(data: string) {
        const uniqueId: number = Math.max(...this._items.map(item => Number(item.id)),0) + 1;
        const newItem: IItem = {id:String(uniqueId), name: data};
        this._items.push(newItem);
        this.emit('changed');
        return newItem;
    }

    /**
     * Удаляет задачу по её id.
     * @param id — идентификатор задачи
     *
     * Удаляет все элементы, у которых `item.id !== id`.
     * После изменения эмитит событие `changed`.
     */
    removeItem(id: string) {
        this._items = this._items.filter(item => item.id !== id);
        this.emit('changed');
    }

    /**
     * Редактирует название задачи по её id
     * @param id — строковый идентификатор задачи
     * @param name — новое название задачи
     *
     * 1. Находит задачу в массиве `_items` методом `find()`, сравнивая `item.id` с переданным `id`.
     * 2. Если задача найдена — обновляет её свойство `name` на новое значение.
     * 3. Если задача с таким id отсутствует, метод ничего не делает
     *    (в текущей реализации ошибки не выбрасываются).
     * Генерирует событие changed.
     *
     * Используется при редактировании задачи в интерфейсе:
     * после вызова метод обновляет данные в модели,
     * а затем презентер перерисовывает список (`renderView()`).
     */
    editItem(id: string, name: string) {
        const editedItem = this._items.find(item => item.id === id);
        editedItem.name = name;
        this.emit('changed');
    }

    /**
     * Возвращает задачу по её id
     * @param id — строка, содержащая идентификатор задачи
     *
     * 1. Выполняет поиск в массиве `_items` методом `find()`.
     * 2. Сравнивает `item.id` каждого элемента с переданным `id`.
     * 3. Если задача найдена — возвращает объект задачи `{id, name}`.
     * 4. Если задача с таким id отсутствует — возвращает `undefined`.
     *
     * Этот метод используется, когда нужно получить данные одной конкретной задачи
     * для дальнейших действий, например:
     *  - копирования
     *  - редактирования
     *  - отображения подробной информации
     */
    getItem(id: string) {
        return this._items.find(item => item.id === id)
    }
}