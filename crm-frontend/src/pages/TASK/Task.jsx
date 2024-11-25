import { useState, useEffect } from "react";
import AxiosService from "../../components/utils/ApiService";
import TaskList from "./TaskList";

const Task = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await AxiosService.get("/task/tasks");
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container ">
      <div className="row">
        <div className="col-md-12">
     
          <TaskList tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default Task;
