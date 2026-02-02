import React, { Component } from "react";

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

export interface Props {
  params: Param[];
  model: Model;
  onReset?: () => void;
}

interface State {
  paramValues: ParamValue[];
}

type ParamComponentProps = {
  param: Param;
  value: string;
  onChange: (paramId: number, value: string) => void;
};

type ParamComponentType = React.ComponentType<ParamComponentProps>;

type ParamComponentRegistry = Record<string, ParamComponentType>;

class ParamEditor extends Component<Props, State> {
  private static paramComponentRegistry: ParamComponentRegistry = {
    string: ({ param, value, onChange }: ParamComponentProps) => (
      <div style={{ padding: "10px" }}>
        <label htmlFor={`param-${param.id}`}>{param.name}</label>
        <input
          id={`param-${param.id}`}
          type="text"
          value={value}
          onChange={(e) => onChange(param.id, e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            boxSizing: "border-box",
          }}
          placeholder={`Введите значение для ${param.name}`}
        />
      </div>
    ),
    number: () => <></>,
  };

  static getParamComponent(type: ParamType): ParamComponentType {
    return (
      this.paramComponentRegistry[type] || this.paramComponentRegistry.string
    );
  }

  static registerParamType(type: string, component: ParamComponentType): void {
    this.paramComponentRegistry[type] = component;
  }

  static get registry(): Readonly<ParamComponentRegistry> {
    return this.paramComponentRegistry;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      paramValues: this.initializeParamValues(
        props.params,
        props.model.paramValues,
      ),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.params !== this.props.params ||
      prevProps.model.paramValues !== this.props.model.paramValues
    ) {
      this.setState({
        paramValues: this.initializeParamValues(
          this.props.params,
          this.props.model.paramValues,
        ),
      });
    }
  }

  private initializeParamValues(
    params: Param[],
    initialValues: ParamValue[],
  ): ParamValue[] {
    return params.map((param) => {
      const existingValue = initialValues.find((pv) => pv.paramId === param.id);
      return {
        paramId: param.id,
        value: existingValue?.value || this.getDefaultValue(param.type),
      };
    });
  }

  private getDefaultValue(type: ParamType): string {
    switch (type) {
      case "string":
        return "";
      case "number":
        return "0";
      default:
        return "";
    }
  }

  private handleParamChange = (paramId: number, value: string) => {
    this.setState((prevState) => ({
      paramValues: prevState.paramValues.map((pv) =>
        pv.paramId === paramId ? { ...pv, value } : pv,
      ),
    }));
  };

  public getModel(): Model {
    return {
      paramValues: [...this.state.paramValues],
      colors: [...this.props.model.colors],
    };
  }

  private getParamValue(paramId: number): string {
    const paramValue = this.state.paramValues.find(
      (pv) => pv.paramId === paramId,
    );
    return paramValue?.value || "";
  }

  render() {
    const { params } = this.props;

    return (
      <div
        className="param-editor"
        style={{
          padding: "30px",
          boxShadow: "0 2px 10px #000",
          maxWidth: "500px",
          width: "100%",
          margin: "0 auto",
        }}
      >
        <h3>Параметры товара</h3>

        {params.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            Нет параметров для отображения
          </p>
        ) : (
          params.map((param) => {
            const ParamComponent = ParamEditor.getParamComponent(param.type);
            return (
              <ParamComponent
                key={param.id}
                param={param}
                value={this.getParamValue(param.id)}
                onChange={this.handleParamChange}
              />
            );
          })
        )}
      </div>
    );
  }
}

export default ParamEditor;
