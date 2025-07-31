// Интерфейс для элемента списка.
// Имеет свойства id для хранения id name для хранения заголовка элемента списка
export interface IItem {
    id: string;
    name: string;
}

// Интерфейс хранилища данных элементов списка.
// Имеет свойство для хранения массива элементов списка.
// Имеет методы для добавления и удаления элементов из хранилища
export interface IToDoModel {
    items: IItem[];
    addItem: (data: string) => IItem;
    removeItem: (id: string) => void;
}