import {useState} from 'react';

export default function CompanyLogin({onLogin}){
    const [form, setForm] = useState({name: "", password: ""});
    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:5000/api/company/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) onLogin(data.companyId);
        else alert(data.error);
        return (
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Company Name" onChange={handleChange}/>
                <input name = "password" placeholder="Password" type="password" onChange={handleChange}/>
                <button> Login </button>
            </form>
        );
    }
}