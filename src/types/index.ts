// Интерфейс для элемента списка задач.
// Содержит:
// - `id`: строка — уникальный идентификатор элемента
// - `name`: строка — текст задачи
export interface IItem {
    id: string;
    name: string;
}

// Интерфейс для модели (хранилища) списка задач.
// Определяет:
// - `items`: массив объектов задач
// - `addItem(data: string)`: метод для добавления новой задачи по строке (возвращает добавленный объект)
// - `removeItem(id: string)`: метод для удаления задачи по её id
// - `getItem: (id: string): метод возвращает дело по id`
// - `editItem: (id: string, name: string) метод для редактирования задачи`
export interface IToDoModel {
    items: IItem[];
    addItem: (data: string) => IItem;
    removeItem: (id: string) => void;
    getItem: (id: string) => IItem;
    editItem: (id: string, name: string) => void;
}