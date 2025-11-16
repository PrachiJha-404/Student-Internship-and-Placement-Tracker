import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("role");

        if (role === "student") navigate("/student/dashboard");
        if (role === "company") navigate("/company/dashboard");
    }, []);
    return (
        <div className="min-h-screen bg-gray-50">

            {/* NAVBAR */}
            <nav className="w-full bg-white shadow-sm py-4 px-8 flex justify-between items-center">
                <h1 className="text-2xl font-extrabold text-blue-700 tracking-wide">
                    Placement Portal
                </h1>

                <div className="space-x-6 font-medium">
                    <a href="#" className="text-gray-600 hover:text-blue-600">About</a>
                    <a href="#" className="text-gray-600 hover:text-blue-600">Contact</a>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="flex flex-col lg:flex-row items-center justify-between px-10 lg:px-24 py-16">

                {/* LEFT TEXT PANEL */}
                <div className="max-w-xl">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                        Streamline Your <span className="text-blue-600">Placement Journey</span>
                    </h2>

                    <p className="mt-6 text-gray-600 text-lg">
                        Track applications, manage interviews, and connect with top recruiters — all in one platform.
                    </p>

                    <div className="mt-8">
                        <a
                            href="#loginOptions"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Get Started
                        </a>
                    </div>
                </div>

                {/* RIGHT ILLUSTRATION */}
                {/* <div className="mt-12 lg:mt-0">
                    <img
                        src="https://cdni.iconscout.com/illustration/premium/thumb/job-interview-6816400-5630740.png"
                        alt="Placement Illustration"
                        className="w-full max-w-lg"
                    />
                </div> */}
            </section>

            {/* LOGIN SECTION */}
            <section id="loginOptions" className="py-16 bg-white">
                <h3 className="text-center text-3xl font-bold text-gray-800 mb-10">
                    Choose Your Portal
                </h3>

                <div className="flex flex-col md:flex-row gap-8 justify-center px-8">

                    {/* STUDENT CARD */}
                    <div className="bg-blue-50 border border-blue-100 p-8 rounded-2xl shadow-md max-w-sm w-full text-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                            className="w-24 mx-auto mb-4"
                            alt="Student"
                        />
                        <h4 className="text-2xl font-bold text-blue-700 mb-4">Student Login</h4>
                        <p className="text-gray-600 mb-6">
                            Apply for jobs, upload resumes, track interview schedules and get updates.
                        </p>
                        <Link
                            to="/login/user"
                            className="block bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Login as Student
                        </Link>
                    </div>

                    {/* COMPANY CARD */}
                    <div className="bg-green-50 border border-green-100 p-8 rounded-2xl shadow-md max-w-sm w-full text-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/1048/1048949.png"
                            className="w-24 mx-auto mb-4"
                            alt="Company"
                        />
                        <h4 className="text-2xl font-bold text-green-700 mb-4">Company Login</h4>
                        <p className="text-gray-600 mb-6">
                            Post jobs, review applications, shortlist candidates and manage interviews.
                        </p>
                        <Link
                            to="/login/company"
                            className="block bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            Login as Company
                        </Link>
                    </div>

                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-6 bg-gray-100 text-center text-gray-600">
                © {new Date().getFullYear()} Placement Portal. All rights reserved.
            </footer>
        </div>
    );
}
