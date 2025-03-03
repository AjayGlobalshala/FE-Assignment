import React, { useState } from "react";
import "../styles/table.css";

interface TableColumn<T> {
  key: keyof T;
  title: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onDelete: (ids: number[]) => void;
  onEdit: (id: number, updatedRow: Partial<T>) => void;
}

export default function Table<T extends { id: number }>({
  columns,
  data,
  onDelete,
  onEdit,
}: TableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<T>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const toggleSelectRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const deleteSelected = () => {
    onDelete(selectedRows);
    setSelectedRows([]);
  };

  const startEditing = (row: T) => {
    setEditingRowId(row.id);
    setEditValues(row);
    setErrors({});
  };

  const handleEditChange = (key: keyof T, value: string) => {
    if (key === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        setErrors((prev) => ({ ...prev, [key]: "Invalid email format" }));
      } else {
        setErrors((prev) => ({ ...prev, [key]: "" }));
      }
    }
    setEditValues((prev) => ({ ...prev, [key]: value }));
  };

  const saveEdit = () => {
    if (
      editingRowId !== null &&
      !Object.values(errors).some((err) => err !== "")
    ) {
      onEdit(editingRowId, editValues);
      setEditingRowId(null);
    }
  };

  return (
    <div className="p-4">
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th>Select</th>
            {columns.map(({ key, title }) => (
              <th key={String(key)} className="p-2">
                {title}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b">
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.id)}
                  onChange={() => toggleSelectRow(row.id)}
                />
              </td>
              {columns.map(({ key }) => (
                <td key={key.toString()} className="p-2">
                  {editingRowId === row.id ? (
                    key === "role" ? (
                      <select
                        value={String(editValues[key] ?? row[key] ?? "")}
                        onChange={(e) => handleEditChange(key, e.target.value)}
                        className="border p-1"
                      >
                        <option value="Member">member</option>
                        <option value="Admin">admin</option>
                      </select>
                    ) : (
                      <div>
                        <input
                          type={key === "email" ? "email" : "text"}
                          value={
                            editValues[key] !== undefined
                              ? String(editValues[key])
                              : String(row[key] ?? "")
                          }
                          onChange={(e) =>
                            handleEditChange(key, e.target.value)
                          }
                          className="border p-1"
                        />
                        {errors[String(key)] && (
                          <p className="text-red-500 text-xs">
                            {errors[String(key)]}
                          </p>
                        )}
                      </div>
                    )
                  ) : (
                    row[key]?.toString() ?? ""
                  )}
                </td>
              ))}

              <td>
                {editingRowId === row.id ? (
                  <button
                    onClick={saveEdit}
                    className="save-btn"
                    disabled={Object.values(errors).some((err) => err !== "")} // Disable if error
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(row)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => onDelete([row.id])}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className={selectedRows.length !== 0 ? "delete-btn-all" : ""}
        onClick={deleteSelected}
        disabled={selectedRows.length === 0}
      >
        Delete Selected
      </button>
    </div>
  );
}
