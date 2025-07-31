import {IItem, IToDoModel} from "../types";

// Класс для хранения данных списка дел
export class ToDoModel implements IToDoModel {
    // Содержит массив объектов - элементов списка
    protected _items: IItem[];

    // Создает пустой массив для элементов списка
    constructor() {
        this._items = [];
    }

    // Принимает массив элементов списка, записывает их в свойство _items
    set items(data: IItem[]) {
        this._items = data;
    }

    // Возвращает массив элементов списка
    get items() {
        return this._items;
    }

    // Метод для добавления элемента списка в массив.
    // Принимает строку - заголовок элемента списка.
    // Генерирует уникальный id - берет максимальный id из массива элементов списка и прибавляет 1.
    // Создает новый объект - элемент списка записывает созданный id в свойство ud, полученную строку в свойство name.
    // Добавляет созданный объект в массив элементов списка.
    // Возвращает созданный объект.
    addItem(data: string): IItem {
        const uniqueId: number = Math.max(... this._items.map(item => Number(item.id))) + 1;
        const newItem: IItem = {id:String(uniqueId), name: data};
        this._items.push(newItem);
        return newItem;
    }

    // Метод для удаления элемента списка из массива.
    // Принимает строку - id элемента списка.
    // Перезаписывает массив элементов без элемента с переданным id.
    removeItem(id: string) {
        this._items = this._items.filter(item => item.id !== id);
    }
}