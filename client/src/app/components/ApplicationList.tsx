"use client"
import React, { useState } from 'react';
import useStore from '../store';

const ApplicationList = () => {
  const {applications} = useStore();
  const [users, setUsers] = useState(applications);

  // Function to toggle user status (Online/Offline)
  const toggleStatus = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === 'applied' ? 'rejected' : 'applied',
            }
          : user
      )
    );
  };

  // Render the user table
  return (
    <div className="shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Position
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((user) => (
            <tr
              key={user.id}
              className="bg-white border-b hover:bg-gray-50"
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id={`checkbox-table-search-${user.id}`}
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2"
                  />
                  <label
                    htmlFor={`checkbox-table-search-${user.id}`}
                    className="sr-only"
                  >
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
              >
                <div className="pl-3">
                  <div className="text-base font-semibold">{user.name}</div>
                </div>
              </th>
              <td className="px-6 py-4">{user.position}</td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      user.status === 'applied' ? 'bg-green-500' : 'bg-red-500'
                    } mr-2`}
                  ></div>
                  {user.status}
                </div>
              </td>
              <td className="px-6 py-4">
                {/* Edit user button */}
             
                  <button onClick={() => toggleStatus(user.id)}
 type="button" className="focus:outline-none text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 ">Update</button>

                 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicationList;
