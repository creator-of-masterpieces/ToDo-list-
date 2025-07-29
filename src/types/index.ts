// Элемент списка.
// Хранит id и заголовок элемента списка
export interface IItem {
    id: string;
    name: string;
}

// Хранилище данных элементов списка.
// Хранит массив элементов списка.
// Имеет методы для добавления и удаления элементов из хранилища
export interface IToDoModel {
    items: IItem[];
    addItem: (data: string) => IItem;
    removeItem: (id: string) => void;
}