import { useState } from "react";

export default function Todo(props) {
    const { todo, setTodos } = props;
    const [isEditing, setIsEditing] = useState(false);
    const [newTodoContent, setNewTodoContent] = useState(todo.todo);

    const updateTodoStatus = async (todoId, todoStatus) => {
        const res = await fetch(`/api/todos/${todoId}`, {
            method: "PUT",
            body: JSON.stringify({ status: !todoStatus }),
            headers: {
                "Content-Type": "application/json"
            },
        });

        const json = await res.json();
        if (json.acknowledged) {
            setTodos(currentTodos => {
                return currentTodos.map((currentTodo) => {
                    if (currentTodo._id === todoId) {
                        return { ...currentTodo, status: !currentTodo.status };
                    }
                    return currentTodo;
                });
            });
        }
    };

    const deleteTodo = async (todoId) => {
        const res = await fetch(`/api/todos/${todoId}`, {
            method: "DELETE"
        });
        const json = await res.json();
        if (json.acknowledged) {
            setTodos(currentTodos => {
                return currentTodos.filter((currentTodo) => (currentTodo._id !== todoId));
            })
        }
    };

    const saveUpdatedTodo = async (todoId) => {
        const res = await fetch(`/api/todos/${todoId}`, {
            method: "PUT",
            body: JSON.stringify({ todo: newTodoContent }),
            headers: {
                "Content-Type": "application/json"
            },
        });

        const json = await res.json();
        if (json.modifiedCount > 0) { // Ensure the update was successful
            setTodos(currentTodos => {
                return currentTodos.map((currentTodo) => {
                    if (currentTodo._id === todoId) {
                        return { ...currentTodo, todo: newTodoContent };
                    }
                    return currentTodo;
                });
            });
            setIsEditing(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-900 rounded-lg shadow-md hover:bg-gray-800 mb-2">
            {isEditing ? (
                <input
                    type="text"
                    value={newTodoContent}
                    onChange={(e) => setNewTodoContent(e.target.value)}
                    className="flex-1 p-2 bg-gray-800 text-white rounded-lg"
                />
            ) : (
                <p className={`flex-1 ${todo.status ? "line-through text-gray-400" : "text-white"}`}>{todo.todo}</p>
            )}
            <div className="flex space-x-2 mt-2 sm:mt-0">
                <button
                    className="text-blue-500 hover:text-blue-400 transition-transform transform hover:scale-110"
                    onClick={() => updateTodoStatus(todo._id, todo.status)}
                >
                    {todo.status ? "☑" : "☐"}
                </button>
                {isEditing ? (
                    <button
                        className="text-green-500 hover:text-green-400 transition-transform transform hover:scale-110"
                        onClick={() => saveUpdatedTodo(todo._id)}
                    >
                        Save
                    </button>
                ) : null}
                <button
                    className="text-red-500 hover:text-red-400 transition-transform transform hover:scale-110"
                    onClick={() => deleteTodo(todo._id)}
                >
                    🗑️
                </button>
            </div>
        </div>
    );
}
