import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Todo from "./assets/Components/Todo";
import Settings from "./assets/Components/Settings";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    async function getTodos() {
      const res = await fetch("/api/todos");
      const todos = await res.json();
      setTodos(todos);
    }
    getTodos();
  }, []);

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      const res = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ todo: content }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await res.json();
      setContent("");
      setTodos([...todos, newTodo]);
    }
  }

  return (
    <Router>
      <div className="container mx-auto p-4 max-w-lg bg-gray-900 rounded-lg shadow-lg">
        <nav className="flex justify-end mb-4">
          <Link to="/settings" className="text-blue-500 hover:text-blue-400 text-2xl">
            <i className="fa fa-cog"></i>
          </Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <h1 className="text-3xl font-bold text-center text-white mb-4">Todos List</h1>
                <form className="flex flex-col sm:flex-row mb-4" onSubmit={createNewTodo}>
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter a new todo..."
                    className="flex-1 p-2 bg-gray-800 text-white rounded-lg border border-gray-700"
                    required
                  />
                  <button className="mt-2 sm:mt-0 sm:ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400" type="submit">Add Todo</button>
                </form>
                <div className="space-y-2">
                  {(todos.length > 0) &&
                    todos.map((todo) => (
                      <Todo key={todo._id} todo={todo} setTodos={setTodos} />
                    ))
                  }
                </div>
              </main>
            }
          />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}
