import React, { useRef } from "react";
import ParamEditor from "./paramEditor/";
import "./App.css";

const App: React.FC = () => {
  const paramEditorRef = useRef<ParamEditor>(null);

  const params = [
    { id: 1, name: "Назначение", type: "string" as const },
    { id: 2, name: "Длина", type: "string" as const },
    { id: 3, name: "Цвет", type: "string" as const },
    { id: 4, name: "Размер", type: "string" as const },
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

  const handleGetModel = () => {
    if (paramEditorRef.current) {
      const currentModel = paramEditorRef.current.getModel();
      console.log("Current model:", currentModel);
      alert(JSON.stringify(currentModel, null, 2));
    }
  };

  const handleReset = () => {
    if (paramEditorRef.current) {
      paramEditorRef.current.resetToInitial();
      console.log("Model reset to initial values");
    }
  };

  const handleResetToEmpty = () => {
    if (paramEditorRef.current) {
      paramEditorRef.current.resetToEmpty();
      console.log("Model reset to empty values");
    }
  };

  const handleResetCallback = () => {
    console.log("Reset callback called from ParamEditor");
  };

  return (
    <div className="App">
      <h1>Редактор параметров товара</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        <ParamEditor
          ref={paramEditorRef}
          params={params}
          model={model}
          onReset={handleResetCallback}
        />

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          <button onClick={handleGetModel}>📋 Получить модель</button>

          <button onClick={handleReset}>🔄 Сбросить к исходным</button>

          <button onClick={handleResetToEmpty}>🗑️ Сбросить к пустым</button>
        </div>
      </div>
    </div>
  );
};

export default App;
