'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';
import apiClient from '@/lib/api';
import TaskCard from '@/components/ui/TaskCard';
import TaskForm from '@/components/ui/TaskForm';
import { Task } from '@/lib/types';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [cookies, , removeCookie] = useCookies(['token']);
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const token = cookies.token;
    if (!token) {
      router.push('/signin');
    }
  }, [cookies.token, router]);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await apiClient.get('/api/v1/tasks');
      setTasks(response.data.tasks || response.data);
      setLoading(false);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/signin');
      }
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    setShowForm(false);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null);
    setShowForm(false);
  };

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const response = await apiClient.patch(`/api/v1/tasks/${task.id}`, {
        complete: !task.complete
      });

      // Update the task in the UI
      setTasks(tasks.map(t =>
        t.id === task.id ? { ...response.data } : t
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleLogout = () => {
    removeCookie('token', { path: '/' });
    router.push('/signin');
  };

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.complete).length;
  const pendingTasks = totalTasks - completedTasks;

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.complete;
    if (filter === 'completed') return task.complete;
    return true; // 'all'
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <p className="mt-4 text-lg text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 to-blue-950">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">Todo Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard/chat')}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full hover:from-cyan-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              >
                AI Chat
              </button>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setShowForm(true);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full hover:from-indigo-500 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              >
                Add Task
              </button>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-400 to-pink-500 rounded-full hover:from-red-500 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 shadow-2xl">
          {/* Stats Section */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-white/20 rounded-xl p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-white/80">Total Tasks</dt>
                  <dd className="text-3xl font-bold">{totalTasks}</dd>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-white/20 rounded-xl p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-white/80">Completed</dt>
                  <dd className="text-3xl font-bold">{completedTasks}</dd>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-white/20 rounded-xl p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <dt className="text-sm font-medium text-white/80">Pending</dt>
                  <dd className="text-3xl font-bold">{pendingTasks}</dd>
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Section */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Your Tasks</h2>
                <p className="text-blue-200 mt-1">Manage your tasks efficiently</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm rounded-full ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  All ({totalTasks})
                </button>
                <button
                  onClick={() => setFilter('active')}
                  className={`px-4 py-2 text-sm rounded-full ${
                    filter === 'active'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Active ({pendingTasks})
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 text-sm rounded-full ${
                    filter === 'completed'
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  Completed ({completedTasks})
                </button>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="mb-6">
              <TaskForm
                task={editingTask}
                onSubmit={editingTask ? handleTaskUpdated : handleTaskCreated}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTask(null);
                }}
              />
            </div>
          )}

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-white">No tasks yet</h3>
              <p className="mt-1 text-blue-200">Get started by creating a new task.</p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  Create your first task
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleTaskDeleted}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}
          </div>
        </div>
      </main>
    </div>
  );
}