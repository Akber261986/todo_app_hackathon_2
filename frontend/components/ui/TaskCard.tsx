import { Task } from '@/lib/types';
import { useState } from 'react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setDeleting(true);
      try {
        onDelete(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
        setDeleting(false);
      }
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md ${task.complete ? 'opacity-70' : ''}`}>
      <div className="p-5">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              checked={task.complete}
              onChange={() => onToggleComplete(task)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
          </div>
          <div className="ml-3 -mt-0.5">
            <h3 className={`text-lg font-medium ${task.complete ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-2 text-sm text-gray-500">
                {task.description}
              </p>
            )}
            <div className="mt-3 flex items-center justify-between">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                task.complete 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.complete ? 'Completed' : 'Pending'}
              </span>
              <time className="text-xs text-gray-500">
                {new Date(task.created_at).toLocaleDateString()}
              </time>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(task)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`text-sm font-medium ${deleting ? 'text-gray-400' : 'text-red-600 hover:text-red-900'}`}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}