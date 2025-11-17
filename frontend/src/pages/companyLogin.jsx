import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function LoginCompany() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const res = await api.post("/api/company/login", { name, password });
      alert("Login Successful!");
      console.log(res.data);
      localStorage.setItem("companyId", res.data.companyId);
      localStorage.setItem("role", "company");
      navigate("/company/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-lg">

        <h2 className="text-2xl font-bold mb-6 text-green-600">
          Recruiter / Company Login
        </h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <input
          type="text"
          placeholder="Company Name"
          className="w-full p-3 border rounded-lg mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
        >
          Login
        </button>

        <p className="text-center text-gray-600 mt-5">
          Don’t have an account?{" "}
          <Link to="/register/company" className="text-green-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}

// import { useState } from "react";

// export default function CompanyLogin({ onLogin }) {
//   console.log("✅ CompanyLogin loaded");

//   const [form, setForm] = useState({ name: "", password: "" });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:5000/api/company/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();
//       if (res.ok) {
//         onLogin(data.companyId); // ✅ switch to dashboard
//       } else {
//         alert(data.error || "Invalid credentials");
//       }
//     } catch (err) {
//       alert("⚠️ Could not reach server");
//       console.error(err);
//     }

//     setLoading(false);
//   };

//   // 🧩 The actual JSX needs to be returned here (outside handleSubmit)
//   return (
//     <div
//       style={{
//         width: "350px",
//         margin: "2rem auto",
//         padding: "1.5rem",
//         borderRadius: "10px",
//         boxShadow: "0 0 8px rgba(0,0,0,0.15)",
//         background: "#fff",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>Company Login</h2>

//       <form onSubmit={handleSubmit}>
//         <input
//           name="name"
//           placeholder="Company Name"
//           value={form.name}
//           onChange={handleChange}
//           required
//           style={{
//             width: "100%",
//             marginBottom: "0.8rem",
//             padding: "0.6rem",
//             border: "1px solid #ccc",
//             borderRadius: "5px",
//           }}
//         />

//         <input
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           required
//           style={{
//             width: "100%",
//             marginBottom: "1rem",
//             padding: "0.6rem",
//             border: "1px solid #ccc",
//             borderRadius: "5px",
//           }}
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             width: "100%",
//             padding: "0.6rem",
//             background: "#007bff",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// }
