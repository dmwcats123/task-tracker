"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Modal from "react-modal";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ToDoList() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const [taskList, setTaskList] = useState([]);
  const [contextMenuVis, setContextMenuVis] = useState(false);
  const [contextMenuLoc, setContextMenuLoc] = useState({ x: 0, y: 0 });
  const [contextMenuTask, setContextMenuTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const contextMenuRef = useRef(null);
  const [newTaskDueDate, setNewTaskDueDate] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState(null);
  const [inputError, setInputError] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/GetTasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(username),
        });
        const data = await response.json();
        setTaskList(data.tasks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    window.addEventListener("mousedown", closeMenu);
    return () => {};
  }, []);

  const closeMenu = (e) => {
    if (
      contextMenuRef.current &&
      contextMenuVis &&
      !contextMenuRef.current.contains(e.target)
    ) {
      console.log("setting menu vis to false");
      setContextMenuVis(false);
    }
  };

  const addTaskClicked = () => {
    setModalOpen(true);
  };

  const renderContextMenu = (e, task) => {
    e.preventDefault(); // Prevent the default context menu from appearing
    const buttonPos = e.target.getBoundingClientRect();
    const position = { x: buttonPos.left, y: buttonPos.top + buttonPos.height };
    setContextMenuLoc(position);
    setContextMenuTask(task);
    setContextMenuVis(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    let newTaskID = null;
    if (!isEdit) {
      newTaskID = Math.random().toString(36).substring(7);
    } else {
      newTaskID = contextMenuTask._id;
    }
    console.log(newTaskDueDate);
    const dueDateString =
      newTaskDueDate.toString().split(" ")[1] +
      " " +
      newTaskDueDate.toString().split(" ")[2] +
      " " +
      newTaskDueDate.toString().split(" ")[3];
    const newTaskData = {
      _id: newTaskID,
      title: newTaskTitle,
      description: newTaskDescription,
      status: newTaskStatus,
      dueDate: dueDateString,
      dueDateISO: newTaskDueDate,
    };

    const reqData = {
      username: username,
      newTaskData: newTaskData,
    };
    if (!isEdit) {
      try {
        const response = await fetch("/api/NewTask", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqData),
        });
        const data = await response.json();
        setTaskList(data.tasks);
        setModalOpen(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      try {
        const response = await fetch("/api/EditTask", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqData),
        });
        const data = await response.json();
        setTaskList(data.tasks);
        setModalOpen(false);
        setIsEdit(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskDueDate(null);
    setNewTaskStatus(null);
    setIsEdit(false);
  };

  const handleDateChange = (date) => {
    setNewTaskDueDate(date);
  };

  const handleTaskTitleChange = (event) => {
    setNewTaskTitle(event.target.value);
  };

  const handleTaskDescriptionChange = (event) => {
    setNewTaskDescription(event.target.value);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleStatusChange = (e) => {
    setNewTaskStatus(e.target.value);
  };

  const handleDeleteClicked = async () => {
    console.log("handle delete clicked");
    const reqData = {
      username: username,
      taskID: contextMenuTask._id,
    };

    try {
      const response = await fetch("/api/DeleteTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      });
      const data = await response.json();
      setTaskList(data.tasks);
      setContextMenuVis(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEditClicked = async () => {
    setIsEdit(true);
    setModalOpen(true);
    setNewTaskTitle(contextMenuTask.title);
    setNewTaskDescription(contextMenuTask.description);
    setNewTaskDueDate(new Date(contextMenuTask.dueDateISO));
    setNewTaskStatus(contextMenuTask.status);
    setContextMenuVis(false);
  };
  return (
    <div>
      <button
        onClick={addTaskClicked}
        className="block w-full max-w-xs mt-4 px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-center"
      >
        Add New Task
      </button>
      <ul>
        {taskList.length > 0 &&
          taskList.map((task) => (
            <li key={task._id}>
              <div className="max-w-xs mt-2 mb-2 bg-slate-50 shadow-md rounded px-8 py-6 border-2">
                <div className="flex flex-row w-full">
                  <div>{task.title}</div>
                  <button
                    id={task._id}
                    onClick={(e) => renderContextMenu(e, task)}
                    className="ml-auto"
                  >
                    &#xFE19;
                  </button>
                </div>
                <div>{task.description}</div>
                <div>{task.status}</div>
                <div>{task.dueDate}</div>
              </div>
            </li>
          ))}
      </ul>
      <div> Welcome {username}!</div>
      {contextMenuVis && (
        <div
          className="menu bg-slate-200 p-2 rounded border-2"
          ref={contextMenuRef}
          style={{
            position: "absolute",
            top: contextMenuLoc.y,
            left: contextMenuLoc.x,
          }}
        >
          <ul>
            <li>
              <button onClick={handleDeleteClicked}>Delete</button>
            </li>
            <li>
              <button onClick={handleEditClicked}>Edit</button>
            </li>
          </ul>
        </div>
      )}
      <Modal
        ariaHideApp={false}
        style={{
          content: {
            height: "75%",
            width: "50%",
            margin: "auto",
          },
        }}
        isOpen={modalOpen}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        onRequestClose={handleModalClose}
      >
        <form className="input-form w-3/4" onSubmit={handleModalSubmit}>
          <div className="input-form-column">
            <div className="input-field mb-4">
              <div className="w-full">
                <label className="input-label text-lg font-medium w-full">
                  Task Title:
                </label>
              </div>
              <input
                type="text"
                name="task title"
                value={newTaskTitle}
                onChange={handleTaskTitleChange}
                className="input-field-text bg-white border border-gray-300 rounded-md py-2 px-3 mt-1 w-full"
                placeholder="Task Title"
              />
            </div>
            <div className="input-field mb-4">
              <div className="w-full">
                <label className="input-label text-lg font-medium w-full">
                  Task Description:
                </label>
              </div>
              <input
                type="text"
                name="task title"
                value={newTaskDescription}
                onChange={handleTaskDescriptionChange}
                className="input-field-text bg-white border border-gray-300 rounded-md py-2 px-3 mt-1 w-full"
                placeholder="Task Description"
              />
            </div>
            <div className="input-field mb-4">
              <div className="w-full">
                <label className="input-label text-lg font-medium">
                  Task Due Date:
                </label>
              </div>
              <Datepicker
                className="input-field-datepicker bg-white border border-gray-300 rounded-md py-2 px-3 mt-1 w-full"
                dateFormat="yyyy-MM-dd"
                placeholderText="Task Due Date"
                minDate={new Date()}
                selected={newTaskDueDate}
                onChange={handleDateChange}
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
              />
            </div>
            <div className="input-field mb-4">
              <div className="w-full">
                <label className="input-label text-lg font-medium">
                  Task Status
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="status"
                  value="Not Started"
                  checked={newTaskStatus === "Not Started"}
                  onChange={handleStatusChange}
                />
                <label> Not Started</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="status"
                  value="In Progress"
                  checked={newTaskStatus === "In Progress"}
                  onChange={handleStatusChange}
                />
                <label> In Progress</label>
              </div>
              <div>
                <input
                  type="radio"
                  name="status"
                  value="Completed"
                  checked={newTaskStatus === "Completed"}
                  onChange={handleStatusChange}
                />
                <label> Completed</label>
              </div>
            </div>
            <div className="input-field flex justify-between">
              <button
                type="submit"
                className="block w-full max-w-xs mt-4 px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-center"
              >
                Submit
              </button>
            </div>
            {inputError && (
              <div className="input-form-error text-red-500 mt-4">
                {inputError}
              </div>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ToDoList;
