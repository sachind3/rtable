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
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        );
      },
    },
  ]);

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
  const subHeaderComponent = useMemo(() => {
    return <button>Export</button>;
  });

  return (
    <>
      <Fancybox>
        <DataTable
          title="Contact List"
          pagination
          columns={columns}
          data={data}
          persistTableHead
          subHeader
          subHeaderComponent={subHeaderComponent}
        />
      </Fancybox>
    </>
  );
};
export default App;
