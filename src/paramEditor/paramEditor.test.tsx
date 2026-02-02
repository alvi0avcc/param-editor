import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ParamEditor, { type Param, type Model } from "./index";
import { describe, expect, test, vi } from "vitest";

describe("ParamEditor", () => {
  const mockParams: Param[] = [
    { id: 1, name: "Назначение", type: "string" },
    { id: 2, name: "Длина", type: "string" },
    { id: 3, name: "Цвет", type: "string" },
    { id: 4, name: "Размер", type: "string" },
  ];

  const mockModel: Model = {
    paramValues: [
      { paramId: 1, value: "повседневное" },
      { paramId: 2, value: "макси" },
      { paramId: 3, value: "5" },
      { paramId: 4, value: "Красный" },
    ],
    colors: [
      { id: 1, name: "Красный" },
      { id: 2, name: "Синий" },
    ],
  };

  test("отображает все параметры из props", () => {
    render(<ParamEditor params={mockParams} model={mockModel} />);

    expect(screen.getByLabelText(/Назначение/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Длина/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Цвет/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Размер/i)).toBeInTheDocument();
  });

  test("инициализирует значения из model.paramValues", () => {
    render(<ParamEditor params={mockParams} model={mockModel} />);

    const purposeInput = document.getElementById("param-1") as HTMLInputElement;
    const lengthInput = document.getElementById("param-2") as HTMLInputElement;
    const countInput = document.getElementById("param-3") as HTMLInputElement;
    const colorSelect = document.getElementById("param-4") as HTMLSelectElement;

    expect(purposeInput.value).toBe("повседневное");
    expect(lengthInput.value).toBe("макси");
    expect(countInput.value).toBe("5");
    expect(colorSelect.value).toBe("Красный");
  });

  test("getModel() возвращает корректную структуру", () => {
    let editorRef: ParamEditor | null = null;

    const TestComponent = () => {
      const ref = React.useRef<ParamEditor>(null);

      React.useEffect(() => {
        if (ref.current) {
          editorRef = ref.current;
        }
      }, []);

      return <ParamEditor ref={ref} params={mockParams} model={mockModel} />;
    };

    render(<TestComponent />);

    expect(editorRef).not.toBeNull();

    const model = editorRef!.getModel();

    expect(model.paramValues).toHaveLength(4);
    expect(model.colors).toHaveLength(2);
    expect(model.paramValues[0].value).toBe("повседневное");
    expect(model.paramValues[1].value).toBe("макси");
    expect(model.paramValues[2].value).toBe("5");
    expect(model.paramValues[3].value).toBe("Красный");
  });

  test("изменение значения обновляет состояние", () => {
    render(<ParamEditor params={mockParams} model={mockModel} />);

    const purposeInput = document.getElementById("param-1") as HTMLInputElement;

    fireEvent.change(purposeInput, { target: { value: "новое назначение" } });

    expect(purposeInput.value).toBe("новое назначение");
  });

  test("вызывает onReset колбек при resetToInitial", () => {
    const handleReset = vi.fn();
    let editorRef: ParamEditor | null = null;

    const TestComponent = () => {
      const ref = React.useRef<ParamEditor>(null);

      React.useEffect(() => {
        if (ref.current) {
          editorRef = ref.current;
        }
      }, []);

      return (
        <ParamEditor
          ref={ref}
          params={mockParams}
          model={mockModel}
          onReset={handleReset}
        />
      );
    };

    render(<TestComponent />);

    editorRef!.resetToInitial();

    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  test("работает с пустыми параметрами", () => {
    const emptyModel: Model = {
      paramValues: [],
      colors: [],
    };

    render(<ParamEditor params={[]} model={emptyModel} />);

    expect(
      screen.getByText("Нет параметров для отображения"),
    ).toBeInTheDocument();
  });

  test("обрабатывает параметры без начальных значений", () => {
    const paramsWithNew: Param[] = [
      ...mockParams,
      { id: 5, name: "Новый параметр", type: "string" },
    ];

    const modelWithoutNew: Model = {
      ...mockModel,
      paramValues: mockModel.paramValues,
    };

    render(<ParamEditor params={paramsWithNew} model={modelWithoutNew} />);

    const newParamInput = document.getElementById(
      "param-5",
    ) as HTMLInputElement;
    expect(newParamInput.value).toBe("");
  });
});
