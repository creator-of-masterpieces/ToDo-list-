# ToDo-List — учебный проект на TypeScript (MVP + событийная шина)

Проект без фреймворков на **TypeScript** с архитектурой **MVP (Model–View–Presenter)** и простой событийной шиной. Цель — практическая демонстрация разделения слоёв и взаимодействия модулей.

## Быстрый запуск
```bash
npm install
# см. точные названия команд в package.json вашего проекта:
# например: npm run start / npm run dev / npm run build
```

> Проект собран на Webpack; шаблон страницы — `src/pages/index.html`.

---

## Структура проекта

```
ToDo-list--main/
├── package.json
├── tsconfig.json
├── webpack.config.js
├── src/
│   ├── index.ts
│   ├── components/
│   │   ├── EventEmitter.ts
│   │   ├── Form.ts
│   │   ├── Item.ts
│   │   ├── Page.ts
│   │   ├── Popup.ts
│   │   ├── ToDoModel.ts
│   │   └── ToDoPresenter.ts
│   ├── images/                # svg-иконки
│   ├── pages/
│   │   └── index.html         # HTML-шаблон
│   ├── styles/
│   │   ├── normalize.css
│   │   └── styles.css
│   ├── types/
│   │   └── index.ts           # интерфейсы (IItem, IToDoModel и др.)
│   └── utils/
│       └── constants.ts       # исходный массив задач (todos) и константы
```

---

## Роли модулей и взаимосвязь слоёв

**Слой Model**
- `components/ToDoModel.ts`; — хранит массив задач и реализует операции: добавить, удалить, отредактировать, получить по id;
- эмитит событие `changed` при каждом изменении данных.

**Слой View**
- `components/Page.ts`; — управляет основным DOM: контейнер формы `.todo-form-container` и список задач `.todos__list` (замена содержимого через `replaceChildren`);
- `components/Form.ts`; — компонент формы: рендер из шаблона, чтение/запись значения, `submit` → эмит события с payload `{ value: string }`;
- `components/Item.ts`; — карточка задачи: вывод текста и кнопки действий, эмит событий `copy | delete | edit` с payload `{ id: string }`;
- `components/Popup.ts`; — базовый модальный слой: установка `content`, открытие/закрытие, клики по фону/крестику.

**Слой Presenter**
- `components/ToDoPresenter.ts`; — центральная «склейка» MVP:
  - подтягивает HTML-шаблоны по id: `#todo-item-template` и `#todo-form-template`;
  - создаёт формы:
    - форма добавления; — кнопка «Добавить», placeholder «Следующее дело»;
    - форма редактирования; — кнопка «Изменить», placeholder «Новое название» (рендерится в попапе);
  - подписывается на `model.changed` → вызывает `renderView()`; — пересборка списка;
  - вешает обработчики:
    - `todoForm.submit` → `model.addItem(value)` → очистка формы;
    - `todoEditForm.submit` → `model.editItem(id, value)` → закрытие попапа;
    - для каждой карточки: `copy | delete | edit` → соответствующие методы модели/попапа;
  - собирает DOM-элементы задач через `Item.render(item)` и передаёт их `Page.todoContainer`.

**Точка входа**
- `src/index.ts`; — инициализирует проект: создаёт `Page`, `ToDoModel`, `Popup`, подставляет стартовые задачи из `utils/constants.ts`, конструирует `ItemPresenter`, вызывает `init()` и `renderView()`.

---

## Поток данных (MVP + события)

```
Пользователь → (клик/submit) → View(Form/Item/Popup)
→ emit намерения (submit/copy/delete/edit) → Presenter
→ действия модели (addItem/editItem/removeItem/getItem) → Model
→ Model.emit('changed') → Presenter.renderView()
→ View(Page/Item) обновляет DOM
```

**Принципы**
- View не знает о модели; — только эмитит намерения и рендерит то, что передали.
- Model не знает о DOM; — хранит и изменяет данные, оповещает через `changed`.
- Presenter — единственная «точка координации»: подписки, маршрутизация событий, рендер.

---

## Контракт событий (по коду)

**Из View**
- Form: `submit` → `{ value: string }`;
- Item: `copy | delete | edit` → `{ id: string }`.

**Из Model**
- `changed` → без payload; — сигнал перерисовки.

**Popup**
- Управляется методами `open()/close()`; — содержимое передаётся через сеттер `content`.

---

## Модель данных

Главная сущность — **задача** (`types/index.ts`):
```ts
interface IItem {
  id: string;
  name: string;
}
```

**Инварианты**
- `id` уникален; — генерируется как `maxId + 1` (числовая часть, хранится как строка);
- `name` — текст задачи; — изменяется только через публичные методы модели;
- состояние — в памяти; — источник истины: `ToDoModel.items`.

---

## Поведение ключевых методов (коротко)

**ToDoModel**
- `set items(data: IItem[])`; — замена массива; → `emit('changed')`;
- `get items()`; — текущий массив;
- `addItem(name: string)`; — создаёт `{ id, name }`, пушит; → `emit('changed')`;
- `removeItem(id: string)`; — фильтрует по id; → `emit('changed')`;
- `editItem(id: string, name: string)`; — находит и меняет `name`; → `emit('changed')`;
- `getItem(id: string)`; — ищет задачу по id.

**ToDoPresenter**
- `init()`; — создаёт формы, монтирует форму добавления в `Page.formContainer`, подписывается на `changed`/`submit`;
- `handleSubmitForm({ value })`; — `addItem` + `todoForm.clearValue()`; — ререндер;
- `handleCopyItem({ id })`; — `getItem` → `addItem(copy.name)`; — ререндер;
- `handleDeleteItem({ id })`; — `removeItem(id)`; — ререндер;
- `handleEditItem({ id })`; — `getItem` → заполнить `todoEditForm` → вставить в `Popup.content` → задать обработчик submit → `open()`; — внутри обработчика: `editItem` → `todoForm.clearValue()` → `close()`;
- `renderView()`; — создаёт `Item` для каждого `IItem`, навешивает обработчики, рендерит, разворачивает список (новые сверху), отдаёт `Page.todoContainer`.

**Page**
- `formContainer = HTMLFormElement | null`; — замена/очистка контейнера формы;
- `todoContainer = HTMLElement[]`; — полная замена списка задач (`replaceChildren(...nodes)`).

**Form**
- `render()`; — DOM формы;
- `setValue/getValue/clearValue()`; — управление полем ввода;
- сеттеры `buttonText` и `placeholder`.

**Item**
- `render(item: IItem)`; — возвращает DOM карточки, вешает `copy/delete/edit`.

**Popup**
- `content = HTMLElement`; — замена содержимого;
- `open()/close()`; — управление классом видимости; — закрытие по фону/крестику.

---

## Расширение и поддержка

- Новые действия добавляйте через:
  - намерения во View (кнопки/формы) → emit события;
  - публичные методы в Model; — изменения состояния + `changed`;
  - маршруты в Presenter; — подписки и рендер.
- Имена событий держите единообразно; — полезно вынести в константы/enum.
- Документируйте публичные API TSDoc; — особенно Presenter и Model.
- Для тестируемости сохраняйте правило: Model без DOM; View без знания о Model.

---

## FAQ (частые вопросы)

**Почему новые задачи появляются сверху списка?**  
В `Presenter.renderView()` к массиву применяется `.reverse()`, чтобы последние добавленные задачи оказывались первыми.

**Что делать, если форма не работает?**  
Проверьте правильность id-шаблонов:  
- `#todo-form-template` — для формы;  
- `#todo-item-template` — для задачи.

**Как добавить новое поле в задачу (например, статус)?**  
1. Добавьте поле в интерфейс `IItem`;  
2. Обновите методы `ToDoModel` (create/edit);  
3. Расширьте рендеринг в `Item.render`;  
4. Обновите Presenter (логика изменения).

