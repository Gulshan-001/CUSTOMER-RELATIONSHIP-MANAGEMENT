import Task from "../models/task.js";
import user from '../models/user.js'
import mongoose from "../models/index.js";

const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo } = req.body;

        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
            return res.status(400).json({
                message: 'Invalid user ID format',
            });
        }

        const existingUser = await user.findById(assignedTo);

        if (!existingUser) {
            return res.status(400).json({
                message: 'User not found',
            });
        }
        const task = await Task.create({
            title,
            description,
            createdBy: req.headers.userId,
            assignedTo,
        });

        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


const getTaskById = async (req, res) => {
    try {
        const assignedTo = req.headers.userId;

        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const tasks = await Task.find({ assignedTo });

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for the specified user' });
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};




const getTaskbyTaskId = async (req, res) => {
    try {
        const taskId = req.params.taskId;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Error fetching task by ID:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

const submitTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { frontendUrl, backendUrl } = req.body;

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }



        if (task.status === 'Submitted') {
            return res.status(400).json({ message: 'Task has already been submitted' });
        }

        task.status = 'Submitted';
        task.frontendUrl = frontendUrl;
        task.backendUrl = backendUrl;

        await task.save();

        res.status(200).json({ message: 'Task submitted successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};



const getTasksByStatus = async (req, res) => {
    try {
        const { status } = req.query;

        let tasks;
        if (status && status.toLowerCase() === 'all') {
            tasks = await Task.find();
        } else if (status) {
            tasks = await Task.find({ status });
        } else {
            return res.status(400).json({ message: 'Status parameter is required' });
        }

        if (tasks.length === 0) {
            return res.status(404).json({ message: `No tasks with status ${status} found` });
        }

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


const getAllTask = async (req, res) => {
    try {
        const tasks = await Task.find();

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found' });
        }
        const totalTasks = tasks.length;
        const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
        const submittedTasks = tasks.filter(task => task.status === 'Submitted').length;

        res.status(200).json({
            totalTasks,
            pendingTasks,
            submittedTasks,
            tasks
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.deleteOne({ _id: taskId });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


const editTask = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { title, description, assignedTo } = req.body;

        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: 'Invalid task ID' });
        }

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (!title || !description || !assignedTo) {
            return res.status(400).json({ message: 'These (title, description, assignedTo) must be provided for update' });
        }

        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
            return res.status(400).json({ message: 'Invalid assignedTo ID' });
        }

        if (title) {
            task.title = title;
        }
        if (description) {
            task.description = description;
        }
        if (assignedTo) {
            const isValidAssignedTo = await user.findById(assignedTo);
            if (!isValidAssignedTo) {
                return res.status(400).json({ message: 'Invalid assignedTo ID' });
            }

            task.assignedTo = assignedTo;
        }

        await task.save();

        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


export default {
    createTask,
    submitTask,
    getTaskById,
    getTaskbyTaskId,
    getTasksByStatus,
    getAllTask,
    deleteTask,
    editTask
}