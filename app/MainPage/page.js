"use client";
import React from "react";
import "./MainPage.css";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function MainPage() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const [taskList, setTaskList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTaskDueDate, setNewTaskDueDate] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [inputError, setInputError] = useState("");
  const [contextMenuVis, setContextMenuVis] = useState(false);
  const [contextMenuLoc, setContextMenuLoc] = useState({ x: 0, y: 0 });
  const [contextMenuTask, setContextMenuTask] = useState(null);
  const contextMenuRef = useRef(null);
  const [sortValue, setSortValue] = useState("Due Date");
  const [sortByMenuVis, setSortByMenuVis] = useState(false);
  const [sortByMenuLoc, setSortByMenuLoc] = useState({ x: 0, y: 0 });
  const sortByMenuRef = useRef(null);

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

    return () => {};
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        escCloseMenu();
      }
    };

    window.addEventListener("mousedown", closeMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", closeMenu);
    };
  }, []);

  const escCloseMenu = (e) => {
    if (contextMenuRef.current) {
      console.log("setting menu vis to false");
      setContextMenuVis(false);
    }

    if (sortByMenuRef.current) {
      console.log("setting menu vis to false");
      setSortByMenuVis(false);
    }
  };
  const closeMenu = (e) => {
    console.log("close menu called");
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
      console.log("setting menu vis to false");
      setContextMenuVis(false);
    }

    if (sortByMenuRef.current && !sortByMenuRef.current.contains(e.target)) {
      console.log("setting menu vis to false");
      setSortByMenuVis(false);
    }
  };

  const addTaskClicked = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
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

  const handleStatusChange = (e) => {
    setNewTaskStatus(e.target.value);
  };

  const renderContextMenu = (e, task) => {
    e.preventDefault(); // Prevent the default context menu from appearing
    const buttonPos = e.target.getBoundingClientRect();
    const position = { x: buttonPos.left, y: buttonPos.top + buttonPos.height };
    setContextMenuLoc(position);
    setContextMenuTask(task);
    setContextMenuVis(true);
  };

  const renderSortByMenu = (e) => {
    e.preventDefault(); // Prevent the default context menu from appearing
    const buttonPos = e.currentTarget.getBoundingClientRect(); // Use currentTarget instead of target
    const position = {
      x: buttonPos.left, // Adjust the x position by adding the width of button content
      y: buttonPos.top + buttonPos.height + window.scrollY,
    };
    setSortByMenuLoc(position);
    setSortByMenuVis(true);
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

  const handleSortDateClicked = () => {
    setSortValue("Due Date");
    setSortByMenuVis(false);
  };

  const handleSortStatusClicked = () => {
    setSortValue("Status");
    setSortByMenuVis(false);
  };

  const handleSortTitleClicked = () => {
    setSortValue("Title");
    setSortByMenuVis(false);
  };

  const sortTasks = () => {
    if (sortValue === "Due Date") {
      const sortedTasks = [...taskList].sort((a, b) => {
        return new Date(a.dueDateISO) - new Date(b.dueDateISO);
      });
      return sortedTasks;
    } else if (sortValue === "Status") {
      const sortedTasks = [...taskList].sort((a, b) => {
        if (a.status > b.status) {
          return -1;
        } else if (a.status < b.status) {
          return 1;
        } else {
          return 0;
        }
      });
      return sortedTasks;
    } else if (sortValue === "Title") {
      const sortedTasks = [...taskList].sort((a, b) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) {
          return -1;
        } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
          return 1;
        } else {
          return 0;
        }
      });
      return sortedTasks;
    }
  };

  const renderTasks = () => {
    return sortTasks().map((task) => {
      return (
        <li className="list-none" key={task._id}>
          <div
            className={
              task.status === "Completed"
                ? "max-w-xs m-2 shadow-md rounded px-8 py-6 border-2 border-completeBorder  bg-completed"
                : task.status === "Not Started"
                ? "max-w-xs m-2 shadow-md rounded px-8 py-6 border-2 border-notStartedBorder  bg-notStarted"
                : "max-w-xs m-2 shadow-md rounded px-8 py-6 border-2 border-inProgressBorder bg-inProgress"
            }
          >
            <div className="flex flex-row w-full">
              <div className="flex flex-row w-full font-bold text-lg">
                {task.title}
              </div>
              <button
                id={task._id}
                onClick={(e) => renderContextMenu(e, task)}
                className="ml-auto"
              >
                &#xFE19;
              </button>
            </div>
            <div className="flex flex-wrap text-sm">{task.description}</div>
            <div className="flex flex-wrap text-sm">
              <div className="font-semibold mr-2">Status:</div> {task.status}
            </div>
            <div className="flex flex-wrap text-sm">
              <div className="font-semibold mr-2">Due Date:</div> {task.dueDate}
            </div>
          </div>
        </li>
      );
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <div className="first-row">
        <div className="title">The Best Task Tracker</div>
        <div className="welcome-user">Welcome {username}!</div>
      </div>
      <div className="flex flex-col bg-slate-300 p-2 mx-10">
        <div className="top-bar">
          <div className="flex flex-row">
            <div className="ml-5  my-auto text-lg font-semibold">
              Your Tasks
            </div>
            <div className="flex flex-row">
              <div className="my-auto mx-2">Sort by:</div>
              <button
                onClick={(e) => renderSortByMenu(e)}
                className="ml-auto my-auto flex flex-row border-2 rounded bg-slate-300 border-slate-500 p-2"
              >
                <div className="flex flex-row">
                  {sortValue}{" "}
                  <div className="down-arrow my-auto ml-2">&#x25BC;</div>
                </div>
              </button>
            </div>
          </div>
          <button
            onClick={addTaskClicked}
            className="w-full max-w-xs my-2 mr-5 px-4 py-2 bg-inProgressBorder text-white rounded hover:bg-inProgressHover text-center"
          >
            Add New Task
          </button>
        </div>

        <div className="grid grid-cols-4 gap-1">
          {
            taskList.length > 0 && renderTasks()
            /* 
            taskList.map((task) => (
              <li className="list-none" key={task._id}>
                <div
                  className={
                    task.status === "Completed"
                      ? "max-w-xs m-2 shadow-md rounded px-8 py-6 border-2 border-completeBorder  bg-completed"
                      : task.status === "Not Started"
                      ? "max-w-xs m-2 shadow-md rounded px-8 py-6 border-2 border-notStartedBorder  bg-notStarted"
                      : "max-w-xs m-2 shadow-md rounded px-8 py-6 border-2 border-inProgressBorder bg-inProgress"
                  }
                >
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
                  <div className="flex flex-wrap">{task.description}</div>
                  <div className="flex flex-wrap">{task.status}</div>
                  <div className="flex flex-wrap">{task.dueDate}</div>
                </div>
              </li>
            ))}
            */
          }
        </div>
      </div>

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
      {sortByMenuVis && (
        <div
          className="menu bg-slate-200 p-2 rounded border-2"
          ref={sortByMenuRef}
          style={{
            position: "absolute",
            top: sortByMenuLoc.y,
            left: sortByMenuLoc.x,
          }}
        >
          <ul>
            <li>
              <button onClick={handleSortDateClicked}>Due Date</button>
            </li>
            <li>
              <button onClick={handleSortStatusClicked}>Status</button>
            </li>
            <li>
              <button onClick={handleSortTitleClicked}>Title</button>
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

export default MainPage;
