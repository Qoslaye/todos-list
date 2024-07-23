// Importing necessary modules from React and React Router
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Importing React hooks useEffect and useState
import { useEffect, useState } from "react";

// Importing custom components
import Todo from "./assets/Components/Todo"; // Component to display individual todo items
import Settings from "./assets/Components/Settings"; // Settings page component

// Exporting the main App component
export default function App() {
  // State to store the list of todos, initialized as an empty array
  const [todos, setTodos] = useState([]);

  // State to store the content of the new todo being created
  const [content, setContent] = useState("");

  // useEffect hook to fetch todos from the server when the component mounts
  useEffect(() => {
    async function getTodos() {
      // Fetching todos from the server API
      const res = await fetch("/api/todos");

      // Parsing the response JSON to extract todos
      const todos = await res.json();

      // Setting the todos state with the fetched data
      setTodos(todos);
    }

    // Calling the async function to fetch todos
    getTodos();
  }, []);

  // Function to handle the creation of a new todo
  const createNewTodo = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();

    // Check if the todo content length is greater than 3 characters
    if (content.length > 3) {
      // Making a POST request to the server to create a new todo
      const res = await fetch("/api/todos", {
        method: "POST", // HTTP method for creating new data
        body: JSON.stringify({ todo: content }), // Sending the todo content as JSON in the request body
        headers: {
          "Content-Type": "application/json", // Setting the content type of the request
        },
      });

      // Parsing the response JSON to get the newly created todo
      const newTodo = await res.json();

      // Clearing the input field
      setContent("");

      // Adding the new todo to the existing todos array
      setTodos([...todos, newTodo]);
    }
  }

  // Rendering the main application
  return (
    <Router> {/* Setting up the React Router for navigation */}
      <div className="container mx-auto p-4 max-w-lg bg-gray-900 rounded-lg shadow-lg">
        {/* Main container with max width, padding, background color, rounded corners, and shadow */}

        <nav className="flex justify-end mb-4">
          {/* Navigation bar positioned at the end of the container with a bottom margin */}
          <Link to="/settings" className="text-blue-500 hover:text-blue-400 text-2xl">
            {/* Link to the Settings page with blue text color, larger font size, and hover effect */}
            <i className="fa fa-cog"></i> {/* Font Awesome cog icon for settings */}
          </Link>
        </nav>

        <Routes> {/* Defining routes for different application paths */}
          <Route
            path="/"
            element={
              <main> {/* Main content area for the Todos List */}
                <h1 className="text-3xl font-bold text-center text-white mb-4">Todos List</h1>
                {/* Heading for the todos list with center alignment, white color, and bottom margin */}

                <form className="flex flex-col sm:flex-row mb-4" onSubmit={createNewTodo}>
                  {/* Form for creating a new todo, with responsive flex layout and bottom margin */}
                  <input
                    type="text"
                    value={content} // Controlled input field bound to the content state
                    onChange={(e) => setContent(e.target.value)} // Updates content state on input change
                    placeholder="Enter a new todo..." // Placeholder text in the input field
                    className="flex-1 p-2 bg-gray-800 text-white rounded-lg border border-gray-700"
                    // Styling the input field with padding, background color, text color, rounded corners, and border
                    required // Makes the input field required for form submission
                  />
                  <button
                    className="mt-2 sm:mt-0 sm:ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
                    type="submit"
                  >
                    {/* Button to submit the form and create a new todo */}
                    Add Todo {/* Button text */}
                  </button>
                </form>

                <div className="space-y-2">
                  {/* Container for displaying the list of todos with vertical spacing between items */}
                  {(todos.length > 0) &&
                    todos.map((todo) => (
                      <Todo key={todo._id} todo={todo} setTodos={setTodos} />
                      // Rendering the Todo component for each todo item in the list
                      // Passing the todo item and setTodos function as props
                    ))
                  }
                </div>
              </main>
            }
          />

          <Route path="/settings" element={<Settings />} />
          {/* Route for the Settings page, rendering the Settings component */}
        </Routes>
      </div>
    </Router>
  );
}
