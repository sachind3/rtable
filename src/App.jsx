import axios from "axios";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import DataTable from "react-data-table-component-with-filter";
import { AppContext } from "./context";
import Fancybox from "./utils/fancybox";

const App = () => {
  const { todos, setTodos } = useContext(AppContext);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (todos?.length > 0) {
      setData(todos);
    }
  }, [todos]);

  const columns = useCallback([
    {
      name: "Todo",
      selector: (row) => row.todo,
      sortable: true,
      filterable: true,
      reorder: true,
      row: (i) => {
        console.log(i);
      },
      cell: (state) => {
        return InputState("todo", state, data, setData);
      },
    },
    {
      name: "City",
      selector: (row) => row.city,
      sortable: true,
      filterable: true,
      reorder: true,
      row: (i) => {
        console.log(i);
      },
      cell: (state) => {
        return InputState("city", state, data, setData);
      },
    },
    {
      name: "Image",
      selector: (row) => row.image,
      cell: (row) => (
        <a href={row.image} data-fancybox="gallery">
          <img src={row.image} alt={row.id} width="50" />
        </a>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.completed,
      sortable: true,
      filterable: true,
      reorder: true,
      conditionalCellStyles: [
        {
          when: (row) => row.completed === "rejected",
          style: { backgroundColor: "red" },
        },
        {
          when: (row) => row.completed === "approved",
          style: { backgroundColor: "green" },
        },
      ],
    },
    {
      cell: (state) => {
        return (
          <select
            name="status"
            id="status"
            onChange={(e) => handleClick(e.target.value, state)}
            className="btn"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        );
      },
    },
    {
      cell: (state) => {
        return (
          <button
            className="btn"
            type="button"
            onClick={(e) => updateData(e, state)}
          >
            Action
          </button>
        );
      },
    },
  ]);

  const InputState = (name, state, data, setData) => {
    // const [newVal, setNewVal] = useState(state[name]);
    const handleChange = (e, id) => {
      const { name, value } = e.target;
      const editData = data.map((item) => {
        return item.id === id && name ? { ...item, [name]: value } : item;
      });
      setData(editData);
    };
    return (
      <input
        className="input-table"
        name={name}
        value={state[name]}
        onChange={(e) => handleChange(e, state.id)}
      />
    );
  };

  const handleClick = async (value, state) => {
    try {
      const res = await axios.patch(`http://localhost:3000/todos/${state.id}`, {
        completed: value,
      });
      const updatedTotos = todos.map((item) => {
        return item.id === state.id ? { ...item, completed: value } : item;
      });
      setTodos(updatedTotos);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateData = async (e, state) => {
    try {
      const res = await axios.patch(`http://localhost:3000/todos/${state.id}`, {
        ...state,
      });
      const updatedTotos = todos.map((item) => {
        return item.id === state.id ? { ...state } : item;
      });
      setTodos(updatedTotos);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    console.log(state);
  };

  return (
    <>
      <Fancybox>
        <DataTable pagination columns={columns} data={data} />
      </Fancybox>
    </>
  );
};
export default App;
