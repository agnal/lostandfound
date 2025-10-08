// import { useState, useEffect } from 'react';
// import axiosInstance from '../axiosConfig';
// import ItemList from '../components/ItemList';
// import SortDropdown from '../components/SortDropdown';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';

// const Tasks = () => {
//   const { user } = useAuth();
//   const [tasks, setTasks] = useState([]);
//   const [sortBy, setSortBy] = useState('recent'); // Strategy
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const response = await axiosInstance.get(`/api/main/items/all?sortBy=${sortBy}`, {
//           headers: { Authorization: `Bearer ${user.token}` },
//         });
//         setTasks(response.data);
//       } catch (error) {
//         console.error('Failed to fetch tasks.', error);
//       }
//     };

//     if (user) fetchTasks();
//   }, [user, sortBy]);

//   return (
//     <div className="container mx-auto p-6 relative">
//       {/* Strategy Pattern Dropdown */}
//       <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />

//       {/* Task List */}
//       <ItemList initialTasks={tasks} />

//       {/* Floating Action Button */}
//       {!user?.isAdmin && (
//         <button
//           className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl"
//           aria-label="Add Lost or Found Item"
//           onClick={() => navigate('/add-items')}
//         >
//           +
//         </button>
//       )}
//     </div>
//   );
// };

// export default Tasks;

import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import React from "react";
import { MenuBar } from "../components/MenuBar";
import { Button } from "../components/ui/button";

const featureItems = [
  {
    icon: "https://c.animaapp.com/mg7at5dvnSTE4c/img/icon1.svg",
    title: "Easy Reporting",
    description: "Report lost or found items quickly using our platform.",
  },
  {
    icon: "https://c.animaapp.com/mg7at5dvnSTE4c/img/icon2.svg",
    title: "Secure Connection",
    description: "Connect securely with owners or finders without sharing personal info.",
  },
  {
    icon: "https://c.animaapp.com/mg7at5dvnSTE4c/img/icon3.svg",
    title: "Track Status",
    description: "Monitor the status of your items until they are safely returned.",
  },
];

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get(`/api/main/items/all?sortBy=${sortBy}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks.', error);
      }
    };

    if (user) fetchTasks();
  }, [user, sortBy]);

  return (
    <div className="relative w-full min-w-[1440px] min-h-screen bg-white overflow-hidden">
      
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <MenuBar />
      </div>

      {/* Hero Section */}
      <section
        className="flex flex-col w-full h-[640px] items-center gap-[100px] pt-[150px] pb-0 px-10 rounded-b-[16px] overflow-hidden"
        style={{ backgroundColor: "var(--backgroundbackground-1)" }}
      >
        <div className="flex max-w-[1500px] w-[1044px] h-[476px] items-center gap-20 relative">
          <div className="flex flex-col w-[547px] h-[280px] items-start gap-[50px] relative">
            <div className="flex flex-col w-[547px] h-[267px] items-start gap-6 relative">
              <h1
                className="text-[80px] font-heading-1 animate-fade-in"
                style={{ color: "var(--textparagraph)" }}
              >
                Back2You
              </h1>
              <p
                className="text-lg font-paragraph animate-fade-in"
                style={{ color: "var(--textparagraph)" }}
              >
                Helping lost things find their way home!
              </p>
            </div>

            <Button
              className="h-[47px] w-[126px] bg-[rgba(46,79,33,1)] hover:bg-[rgba(46,79,33,0.9)] rounded-full text-white transition-colors animate-fade-in"
              onClick={() => navigate("/lost-items")}
            >
              Report Lost Item
            </Button>
          </div>

          <img
            className="w-[476px] h-[476px] object-cover animate-fade-in"
            alt="Hero"
            src="https://c.animaapp.com/mg7at5dvnSTE4c/img/chatgpt-image-sep-29--2025-at-03-01-33-pm-1.png"
          />
        </div>
      </section>

      {/* Services Section */}
      <section
        className="flex flex-col w-full items-center py-32 px-10"
        style={{ backgroundColor: "var(--backgroundbackground-2)" }}
      >
        <div className="flex flex-col max-w-[1500px] items-center gap-[106px] w-full">
          <div className="flex flex-col items-center gap-6 w-full">
            <h2
              className="text-2xl font-medium animate-fade-in"
              style={{ color: "var(--textparagraph)" }}
            >
              Services
            </h2>
            <p
              className="text-center animate-fade-in max-w-[1178px]"
              style={{ color: "var(--textparagraph)" }}
            >
              We provide a simple platform to report lost and found items,
              search and claim belongings, connect securely with finders or
              owners and track the status of your items until they are safely
              returned.
            </p>

            <Button
              className="h-[47px] w-[140px] bg-[rgba(46,79,33,1)] hover:bg-[rgba(46,79,33,0.9)] rounded-full text-white transition-colors animate-fade-in"
              onClick={() => navigate("/found-items")}
            >
              Report Found Item
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="flex flex-col w-full items-start gap-10 py-32 px-20">
        <header className="flex items-start justify-center gap-10 w-full">
          <h2
            className="flex-1 animate-fade-in"
            style={{ color: "var(--textparagraph)" }}
          >
            Track it, report it, recover it!
          </h2>
          <p
            className="flex-1 animate-fade-in"
            style={{ color: "var(--textparagraph)" }}
          >
            At Back2You, we believe that every lost item deserves a chance to be
            reunited—whether it&apos;s a student&apos;s backpack, a
            traveler&apos;s passport or a child&apos;s favorite toy.
          </p>
        </header>

        <div className="flex gap-5 w-full">
          {featureItems.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col items-start gap-5 flex-1 border-l border-[#2d4f20] pl-10 pr-10 py-5 animate-fade-in`}
              style={{ animationDelay: `${600 + index * 200}ms` }}
            >
              <img className="w-10 h-10" alt={feature.title} src={feature.icon} />
              <h3 style={{ color: "var(--textparagraph)" }}>{feature.title}</h3>
              <p style={{ color: "var(--textparagraph)" }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-10 py-8 bg-black text-white">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-3xl">Back2You</h3>
            <p className="font-normal text-white/80 text-sm max-w-[300px]">
              Helping lost things find their way home
            </p>
          </div>
          <div className="flex flex-col gap-4 text-right">
            <h4 className="font-semibold text-lg">Need Help?</h4>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="font-normal text-white/60 text-xs uppercase">Phone</span>
                <a href="tel:+61000000000" className="font-medium text-white text-base hover:text-white/80">
                  +61 000 0000 0000
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-normal text-white/60 text-xs uppercase">Email</span>
                <a href="mailto:help@back2you.com" className="font-medium text-white text-base hover:text-white/80">
                  help@back2you.com
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="font-normal text-white/60 text-sm">© 2024 Back2You. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Action Button */}
      {!user?.isAdmin && (
        <button
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl"
          aria-label="Add Lost or Found Item"
          onClick={() => navigate('/add-items')}
        >
          +
        </button>
      )}
    </div>
  );
};

export default Tasks;
