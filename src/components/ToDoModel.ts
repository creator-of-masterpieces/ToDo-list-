import {IItem, IToDoModel} from "../types";

// Класс для хранения и управления данными списка дел (ToDo)
// Реализует интерфейс IToDoModel
export class ToDoModel implements IToDoModel {
    // Приватное хранилище задач — массив объектов с id и name
    protected _items: IItem[];

    /**
     * Конструктор инициализирует пустой список задач
     */
    constructor() {
        this._items = [];
    }

    /**
     * Сеттер списка задач
     * @param data — массив объектов IItem
     * Полностью заменяет внутренний массив задач
     */    set items(data: IItem[]) {
        this._items = data;
    }

    /**
     * Геттер списка задач.
     * Возвращает текущий массив задач
     */
    get items() {
        return this._items;
    }

    /**
     * Добавляет новую задачу в список
     * @param data — текст новой задачи
     *
     * Генерирует уникальный числовой id:
     * - Берёт все существующие id, приводит их к числу
     * - Находит максимум и увеличивает его на 1.
     * Создаёт новый объект задачи и добавляет в массив.
     * Возвращает добавленный объект
     */
    addItem(data: string) {
        const uniqueId: number = Math.max(...this._items.map(item => Number(item.id)),0) + 1;
        const newItem: IItem = {id:String(uniqueId), name: data};
        this._items.push(newItem);
        return newItem;
    }

    /**
     * Удаляет задачу по id
     * @param id — строка id задачи
     *
     * Очищает массив от задачи с соответствующим id
     */
    removeItem(id: string) {
        this._items = this._items.filter(item => item.id !== id);
    }
}