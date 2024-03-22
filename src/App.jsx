import "./App.css";
import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentoperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentoperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentoperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentoperand: `${state.currentoperand || ""}${payload.digit}`,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.previousoperand == null ||
        state.currentoperand == null
      ) {
        return state;
      }

      const result = evaluate(state);

      return {
        ...state,
        overwrite: true,
        previousoperand: null,
        operation: null,
        currentoperand: result,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentoperand == null && state.previousoperand == null) {
        return state;
      }

      if (state.currentoperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousoperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousoperand: state.currentoperand,
          currentoperand: null,
        };
      }
      return {
        ...state,
        previousoperand: evaluate(state),
        currentoperand: null,
        operation: payload.operation,
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentoperand: null,
          overwrite: false,
        };
      }
      if (state.currentoperand == null) {
        return state;
      }
      if (state.currentoperand.length === 1) {
        return {
          ...state,
          currentoperand: null,
        };
      }

      return {
        ...state,
        currentoperand: state.currentoperand.slice(0, -1),
      };
  }
}

function evaluate({ currentoperand, previousoperand, operation }) {
  const previous = parseFloat(previousoperand);
  const current = parseFloat(currentoperand);
  if (isNaN(previous) || isNaN(current)) {
    return null;
  }
  let computation = "";
  switch (operation) {
    case "+":
      computation = previous + current;
      break;
    case "-":
      computation = previous - current;
      break;
    case "*":
      computation = previous * current;
      break;
    case "÷":
      computation = previous / current;
      break;
  }
  return computation.toString();
}

const INT_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function formatoperand(operand) {
  if (operand == null) {
    return "";
  }
  const [integer, decimal] = operand.split(".");
  if (decimal == null) {
    return INT_FORMATTER.format(integer);
  }
  return `${INT_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentoperand, previousoperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatoperand(previousoperand)} {operation}
        </div>
        <div className="current-operand">{formatoperand(currentoperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button className="del-button" onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch}>
        ÷
      </OperationButton>
      <DigitButton digit="7" dispatch={dispatch}>
        7
      </DigitButton>
      <DigitButton digit="8" dispatch={dispatch}>
        8
      </DigitButton>
      <DigitButton digit="9" dispatch={dispatch}>
        9
      </DigitButton>
      <OperationButton operation="*" dispatch={dispatch}>
        *
      </OperationButton>
      <DigitButton digit="4" dispatch={dispatch}>
        4
      </DigitButton>
      <DigitButton digit="5" dispatch={dispatch}>
        5
      </DigitButton>
      <DigitButton digit="6" dispatch={dispatch}>
        6
      </DigitButton>
      <OperationButton operation="-" dispatch={dispatch}>
        -
      </OperationButton>
      <DigitButton digit="1" dispatch={dispatch}>
        1
      </DigitButton>
      <DigitButton digit="2" dispatch={dispatch}>
        2
      </DigitButton>
      <DigitButton digit="3" dispatch={dispatch}>
        3
      </DigitButton>
      <OperationButton operation="+" dispatch={dispatch}>
        +
      </OperationButton>
      <DigitButton digit="0" dispatch={dispatch}>
        0
      </DigitButton>
      <DigitButton digit="." dispatch={dispatch}>
        .
      </DigitButton>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
