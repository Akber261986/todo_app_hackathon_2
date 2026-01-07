import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';
<<<<<<< HEAD
import apiClient from '@/lib/api';
=======
import axios from 'axios';
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setComplete(task.complete);
    } else {
      setTitle('');
      setDescription('');
      setComplete(false);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
<<<<<<< HEAD
=======
      const token = localStorage.getItem('token');
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
      const taskData = {
        title,
        description,
        complete
      };

      let response;
      if (task) {
        // Update existing task
<<<<<<< HEAD
        response = await apiClient.put(`/api/v1/tasks/${task.id}`, taskData);
      } else {
        // Create new task
        response = await apiClient.post('/api/v1/tasks', taskData);
=======
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks/${task.id}`,
          taskData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } else {
        // Create new task
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasks`,
          taskData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
      }

      onSubmit(response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred');
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">
=======
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
        {task ? 'Edit Task' : 'Create New Task'}
      </h3>

      {error && (
<<<<<<< HEAD
        <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-4 py-3 rounded-xl mb-4 text-center" role="alert">
=======
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
<<<<<<< HEAD
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
=======
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
<<<<<<< HEAD
            className="w-full pl-14 pr-5 py-4 bg-white rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400/50 shadow-md"
=======
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
            placeholder="Task title"
          />
        </div>

<<<<<<< HEAD
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
=======
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
<<<<<<< HEAD
            className="w-full pl-14 pr-5 py-4 bg-white rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-400/50 shadow-md"
=======
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
            placeholder="Task description (optional)"
          />
        </div>

        <div className="flex items-center">
          <input
            id="complete"
            type="checkbox"
            checked={complete}
            onChange={(e) => setComplete(e.target.checked)}
<<<<<<< HEAD
            className="h-5 w-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="complete" className="ml-2 block text-sm text-white">
=======
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="complete" className="ml-2 block text-sm text-gray-900">
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
            Mark as complete
          </label>
        </div>

<<<<<<< HEAD
        <div className="flex justify-end space-x-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-400 to-gray-600 rounded-full hover:from-gray-500 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
=======
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
<<<<<<< HEAD
            className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full hover:from-cyan-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg disabled:opacity-50"
=======
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
>>>>>>> 36d2cf9fbc6319f638798696fbcb119bae3d9a9c
          >
            {loading ? (task ? 'Updating...' : 'Creating...') : (task ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>
    </div>
  );
}