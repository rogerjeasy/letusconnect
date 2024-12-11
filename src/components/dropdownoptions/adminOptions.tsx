import {
    FaUserShield,
    FaUsers,
    FaQuestionCircle,
    FaTasks,
    // FaClipboardList,
    FaCogs,
    FaChartLine,
    FaEnvelopeOpenText,
    FaWrench,
    FaLock,
  } from "react-icons/fa";
  
  export const adminOptions = {
    // Admin Dashboard Options
    adminDashboard: [
      { 
        label: "User Management", 
        icon: <FaUsers className="text-blue-500" />, 
        link: "/admin/users" 
      },
      { 
        label: "FAQs Management", 
        icon: <FaQuestionCircle className="text-orange-500" />, 
        link: "/admin/faqs" 
      },
      { 
        label: "Content Moderation", 
        icon: <FaTasks className="text-red-500" />, 
        link: "/admin/content-moderation" 
      },
      { 
        label: "Website Settings", 
        icon: <FaCogs className="text-purple-500" />, 
        link: "/admin/settings" 
      },
      { 
        label: "Site Analytics", 
        icon: <FaChartLine className="text-green-500" />, 
        link: "/admin/analytics" 
      },
      { 
        label: "Email Notifications", 
        icon: <FaEnvelopeOpenText className="text-cyan-500" />, 
        link: "/admin/email-notifications" 
      },
      { 
        label: "System Maintenance", 
        icon: <FaWrench className="text-gray-500" />, 
        link: "/admin/maintenance" 
      },
      { 
        label: "Access Control", 
        icon: <FaLock className="text-yellow-500" />, 
        link: "/admin/access-control" 
      },
      { 
        label: "Admin Profile", 
        icon: <FaUserShield className="text-teal-500" />, 
        link: "/admin/profile" 
      },
    ],
  };  