import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Video, FolderOpen, Users, BarChart } from 'lucide-react';

const stats = [
  { name: 'Total Categories', value: '12', icon: FolderOpen },
  { name: 'Active Courses', value: '24', icon: BookOpen },
  { name: 'Total Lessons', value: '148', icon: Video },
  { name: 'Total Students', value: '2.1k', icon: Users },
];

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            to="/courses/new"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Course
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
          >
            <dt>
              <div className="absolute bg-indigo-500 rounded-md p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <div className="text-sm font-medium text-gray-500">Latest Enrollments</div>
            <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <img
                          className="h-8 w-8 rounded-full"
                          src={`https://ui-avatars.com/api/?name=Student+${i}&background=random`}
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Student {i}
                        </p>
                        <p className="text-sm text-gray-500">
                          Enrolled in Course {i}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">2 hours ago</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Popular Courses</h3>
            <Link
              to="/analytics"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-lg object-cover"
                    src={`https://images.unsplash.com/photo-167${i}956901459-714c12012fab?auto=format&fit=crop&w=100&q=80`}
                    alt=""
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Course Title {i}
                  </h4>
                  <p className="text-sm text-gray-500">{100 * i} students</p>
                </div>
                <div className="ml-auto flex items-center">
                  <BarChart className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-500">
                    {85 + i}% completion
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Reviews</h3>
            <Link
              to="/reviews"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={`https://ui-avatars.com/api/?name=Review+${i}&background=random`}
                      alt=""
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Student Review {i}
                    </p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`h-4 w-4 ${
                            index < 4 ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 15.585l-6.327 3.323 1.209-7.037L.172 7.207l7.046-1.024L10 0l2.782 6.183 7.046 1.024-4.71 4.664 1.209 7.037L10 15.585z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Great course! The content is well-structured and easy to follow.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}