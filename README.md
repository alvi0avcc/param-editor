# Инструкция по установке и использованию компонента `paramEditor`

## Описание

`paramEditor` — React-компонент для визуального редактирования списка параметров товара. Позволяет пользователю вводить значения параметров, получать текущую модель данных, а также сбрасывать значения к исходным либо пустым.

## Установка и запуск

1. **Клонируйте репозиторий:**

   ```bash
   git clone https://github.com/alvi0avcc/param-editor
   cd param-editor
   ```

2. **Установите зависимости:**

   ```bash
   npm install
   ```

3. **Запустите приложение в режиме разработки:**

   ```bash
   npm run dev
   ```

   После запуска приложение будет открыто по адресу, типа: `http://localhost:5173`

## Использование компонента

### Интерфейсы props

- `params: Param[]` — Список параметров (id, name, type, опционально options)
- `model: Model` — Модель с текущими значениями параметров и цветами
- `onReset?: () => void` — (Опционально) Колбэк после сброса параметров

#### Типы параметров (TypeScript)

```ts
export type ParamType = "string" | "number";
export interface Param {
  id: number;
  name: string;
  type: ParamType;
  options?: string[];
}
export interface ParamValue {
  paramId: number;
  value: string;
}
export interface Color {
  id: number;
  name: string;
}
export interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}
```

### Пример использования в приложении

```tsx
import React, { useRef } from "react";
import ParamEditor from "./paramEditor/";

const params = [
  { id: 1, name: "Назначение", type: "string" },
  { id: 2, name: "Длина", type: "string" },
  { id: 3, name: "Цвет", type: "string" },
  { id: 4, name: "Размер", type: "string" },
];
const model = {
  paramValues: [
    { paramId: 1, value: "повседневное" },
    { paramId: 2, value: "макси" },
    { paramId: 3, value: "синий" },
    { paramId: 4, value: "XL" },
  ],
  colors: [
    { id: 1, name: "Красный" },
    { id: 2, name: "Синий" },
    { id: 3, name: "Зеленый" },
  ],
};

const App = () => {
  const paramEditorRef = useRef(null);

  const handleGetModel = () => {
    if (paramEditorRef.current) {
      const currentModel = paramEditorRef.current.getModel();
      alert(JSON.stringify(currentModel, null, 2));
    }
  };

  const handleReset = () => {
    paramEditorRef.current?.resetToInitial();
  };
  const handleResetToEmpty = () => {
    paramEditorRef.current?.resetToEmpty();
  };

  return (
    <div>
      <ParamEditor
        ref={paramEditorRef}
        params={params}
        model={model}
        onReset={() => console.log("Reset done")}
      />
      <button onClick={handleGetModel}>Получить модель</button>
      <button onClick={handleReset}>Сбросить к исходным</button>
      <button onClick={handleResetToEmpty}>Сбросить к пустым</button>
    </div>
  );
};
```

---

## Публичные методы компонента (через ref)

- **getModel()** — возвращает актуальную модель (значения всех параметров и список цветов)
- **resetToInitial()** — сбрасывает значения параметров к исходным (из model.paramValues)
- **resetToEmpty()** — сбрасывает значения параметров к пустым ("", "0")

---

## Кастомизация типов параметров

Для добавления поддержки новых типов параметров используйте статический метод:

```ts
ParamEditor.registerParamType("newType", CustomComponent);
```

Например регистрируем новый тип параметра "date"

```
ParamEditor.registerParamType('date', ({ param, value, onChange }) => (
  <input
    type="date"
    value={value}
    onChange={(e) => onChange(param.id, e.target.value)}
  />
));
```

---

## Требования

- React 19+
- Vite
- npm

Все зависимости уже описаны в `package.json`.
