import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = "https://67ec5105aa794fb3222d8586.mockapi.io/try/tryPersonal";

function TestAPI() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    axios
      .get(API_URL)
      .then((response) => {
        console.log("Kullanıcılar:", response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("GET hatası:", error);
      });
  };

  useEffect(() => {
    axios
      .post(API_URL, {
        phoneNumber: "05541392582",
        email: "berna.kocalar@gmail.com",
      })
      .then(() => {
        console.log("Yeni kullanıcı eklendi!");
        fetchUsers();
      })
      .catch((error) => {
        console.error("POST hatası:", error);
      });
  }, []);

  return (
    <div className="w-full">
      <ul className="space-y-1 text-sm md:text-base">
        <li key={users[3]?.id}>
          <a
            href={`mailto:${users[3]?.email}`}
            className="text-emerald-300 hover:text-white font-semibold break-all"
          >
            {users[3]?.email}
          </a>
        </li>
        <li key={users[3]?.id}>
          <a
            href="https://wa.me/905541392582"
            className="text-emerald-300 hover:text-white font-semibold break-all"
          >
            {users[3]?.phoneNumber}
          </a>
        </li>
      </ul>
    </div>
  );
}

export default TestAPI;
