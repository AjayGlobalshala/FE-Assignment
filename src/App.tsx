import React, { useState, useEffect } from "react";
import Table from "./components/Table";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import "./styles/global.css";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function App() {
  const [data, setData] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://excelerate-profile-dev.s3.ap-south-1.amazonaws.com/1681980949109_users.json"
        );
        const users = await res.json();
        setData(users);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedData = filteredData.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const totalPages = Math.ceil(filteredData.length / 10);

  return (
    <div className="container">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Table
        columns={[
          { key: "name", title: "Name" },
          { key: "email", title: "Email" },
          { key: "role", title: "Role" },
        ]}
        data={paginatedData}
        onDelete={(ids) =>
          setData((Data) => Data.filter((user) => !ids.includes(user.id)))
        }
        onEdit={(id, updatedRow) =>
          setData((prev) =>
            prev.map((user) =>
              user.id === id ? { ...user, ...updatedRow } : user
            )
          )
        }
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
