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
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md ${task.complete ? 'bg-green-50 border-green-200' : ''}`}>
      <div className="px-4 py-2">
        <div className="flex items-start">
          <div className="flex items-center h-5 mt-0.5">
            <input
              type="checkbox"
              checked={task.complete}
              onChange={() => onToggleComplete(task)}
              className="h-4 w-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
            />
          </div>
          <div className="ml-2 flex-1 min-w-0">
            <div className="flex items-start">
              {task.complete && (
                <svg className="h-4 w-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              <h3 className={`text-base font-medium truncate ${task.complete ? 'text-green-700' : 'text-gray-900'}`}>
                {task.title}
              </h3>
            </div>
            {task.description && (
              <p className={`mt-1 text-xs ${task.complete ? 'text-green-600' : 'text-gray-500'} line-clamp-2`}>
                {task.description}
              </p>
            )}
            <div className="mt-2 flex items-center justify-between">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.6rem] font-medium ${
                task.complete
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.complete ? 'Completed' : 'Pending'}
              </span>
              <time className="text-xs text-gray-500 text-right">
                {new Date(task.created_at).toLocaleDateString()}
              </time>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-2 flex justify-end space-x-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(task)}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`text-xs font-medium ${deleting ? 'text-gray-400' : 'text-red-600 hover:text-red-900'}`}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}