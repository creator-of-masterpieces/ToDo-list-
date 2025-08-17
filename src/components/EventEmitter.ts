// Алиас для имени события.
// EventName может быть строкой (например: 'click', 'modal:open')
// или регулярным выражением, если нужно слушать несколько событий по шаблону (например: /^modal:/).
type EventName = string | RegExp;

// Алиас для обработчика события (подписчика).
// Здесь просто указывается, что это любая функция.
type Subscriber = Function;

// Тип данных, передаваемых в "универсальный" обработчик.
// Позволяет слушать все события подряд: хранит имя события и его данные.
type EmitterEvent = {
    eventName: string,
    data: unknown
};

// Интерфейс описывает контракт, который должен выполнять класс брокера событий.
export interface IEvents {
    // T extends object — означает, что данные события должны быть объектом
    // event: EventName — имя события (строка или RegExp)
    // callback: (data: T) => void — функция, которая будет вызвана при наступлении события
    on<T extends object>(event: EventName, callback: (data: T) => void): void;

    // Генерирует (испускает) событие с определёнными данными,
    // Все обработчики, подписанные на это событие (или подходящий шаблон), будут вызваны.
    emit<T extends object>(event: string, data?: T): void;

    // Возвращает функцию, которая сама вызовет emit, когда будет вызвана
    // Это полезно, если тебе нужно "упаковать" вызов события внутрь какой-то другой логики
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

/**
 * Класс EventEmitter — классический брокер событий.
 * Реализует интерфейс IEvents и управляет подпиской, отпиской и вызовом обработчиков.
 * Поддерживает:
 *  - события по имени (строка);
 *  - события по шаблону (RegExp);
 *  - удаление подписчиков;
 *  - очистку всех обработчиков;
 *  - универсальную подписку на все события;
 *  - генерацию событий через функцию-триггер.
 */
export class EventEmitter implements IEvents {

    // Приватное свойство, которое хранит все подписки.
    // Map — это структура данных, как Object, только мощнее. У неё есть ключи (EventName) и значения (Set<Subscriber>)
    // Set — это коллекция уникальных значений. Используется, чтобы не добавлять один и тот же обработчик дважды
    _events: Map<EventName, Set<Subscriber>>;

    // При создании нового объекта EventEmitter, инициализируется пустая Map
    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    // Метод подписки на событие. Он сохраняет коллбэк (обработчик) в Map.
    // Если для события ещё нет набора обработчиков — создаётся новый Set.
    // В него добавляется переданная функция.
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

    /**
     * Отписка от события.
     * Удаляет конкретный обработчик из Set.
     * Если больше нет обработчиков, удаляем само событие из Map.
     */
    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    /**
     * Генерация события.
     * Перебирает все подписки и проверяет:
     *  - если ключ — RegExp, тестирует совпадение с именем события;
     *  - если строка — сравнивает напрямую.
     * Все совпавшие обработчики вызываются.
     */
    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }

    /**
     * Подписка на все события.
     * Используется для глобального логирования или отладки.
     * (Чтобы работало, emit должен прокидывать универсальные данные.)
     */
    onAll(callback: (event: EmitterEvent) => void) {
        this.on("*", callback);
    }

    /**
     * Полная очистка всех подписок.
     * После вызова offAll обработчиков не останется.
     */
    offAll() {
        this._events = new Map<string, Set<Subscriber>>();
    }


    /**
     * Создание "триггера" — функции, которая при вызове сгенерирует событие.
     * @param eventName — имя события
     * @param context — объект с дополнительными данными, которые всегда будут добавлены к событию
     *
     * Возвращает функцию, которая при вызове объединит переданные данные с context
     * и вызовет emit для указанного события.
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}

