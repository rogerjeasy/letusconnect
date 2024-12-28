"use client";

import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";
import { FaUserPlus, FaIdBadge, FaRocket, FaUsers, FaBriefcase, FaComments, FaCalendarAlt, FaHandsHelping } from "react-icons/fa";
import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ModalPopup from "@/components/forms/ModalPopup";

export default function GetStartedPage() {
  const { user, isAuthenticated } = useUserStore();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleCompleteProfileClick = () => {
    if (isAuthenticated && user) {
      router.push("/settings");
    } else {
      setShowModal(true);
    }
  };

  const handleModalRegister = () => {
    router.push("/register");
  };

  const handleModalLogin = () => {
    router.push("/login");
  };

  const handleRegisterNowClick = () => {
    router.push("/register");
  };

  const handleCloseModal = () => {
    setShowModal(false);
  }
  
  return (
    <section className="bg-gray-50 py-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-50 via-white to-blue-50 py-20">
        <div className="container mx-auto px-6 lg:px-20 flex flex-col-reverse md:flex-row items-center gap-16">
            {/* Text Content */}
            <div className="md:w-1/2 h-full flex flex-col justify-center text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 leading-tight mb-6">
                Welcome to <span className="text-blue-600">LetUsConnect</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
                Empowering students, alumni, and professionals to build meaningful 
                connections, advance careers, and foster collaboration. Join the 
                community that helps you thrive and achieve your goals.
            </p>
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                <Link href="/register">
                    <button
                    className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
                    >
                    Register
                    </button>
                </Link>
                <Link href="/login">
                    <button
                    className="bg-white text-blue-600 font-bold px-6 py-3 rounded-lg text-lg hover:bg-gray-100 transition"
                    >
                    Login
                    </button>
                </Link>
            </div>
            </div>

            {/* Visual Content */}
            <div className="md:w-1/2 h-full flex justify-center relative">
            <div className="absolute inset-0 bg-blue-100 w-[24rem] h-[24rem] rounded-full opacity-50 -z-10 blur-lg animate-pulse"></div>
            <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Collaboration Illustration"
                className="rounded-xl shadow-lg w-[90%] h-auto object-cover md:w-[28rem]"
            />
            </div>
        </div>

        {/* Additional Context Section */}
        <div className="mt-16 text-center px-6 lg:px-20">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            What Makes LetUsConnect Unique?
            </h2>
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 lg:p-10">
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Our platform bridges the gap between students, alumni, and industry experts by 
                fostering mentorship, collaboration, and career growth opportunities. Whether 
                you&rsquo;re looking to find a mentor, collaborate on projects, or expand your 
                professional network, LetUsConnect is here to make it happen.
            </p>
            </div>
        </div>
      </div>




      {/* Enhanced Onboarding Steps */}
      <div className="container mx-auto px-6 lg:px-20 mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Getting Started is Easy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Step 1 */}
          <Card isHoverable className="transition-transform hover:scale-105 shadow-lg">
            <CardHeader className="flex justify-center items-center text-blue-600">
              <FaUserPlus size={50} />
            </CardHeader>
            <CardBody className="text-center">
              <h3 className="text-xl font-bold mb-2">Step 1: Register</h3>
              <p className="text-gray-600">
                Sign up with your details to gain access to personalized features and explore the community.
              </p>
            </CardBody>
            <CardFooter className="flex justify-center">
                <Button
                    className="bg-blue-600 text-white font-bold hover:bg-blue-700"
                    size="sm"
                    onClick={handleRegisterNowClick}
                >
                    Register Now
                </Button>
            </CardFooter>
          </Card>

          {/* Step 2 */}
          <Card isHoverable className="transition-transform hover:scale-105 shadow-lg">
            <CardHeader className="flex justify-center items-center text-green-600">
              <FaIdBadge size={50} />
            </CardHeader>
            <CardBody className="text-center">
              <h3 className="text-xl font-bold mb-2">Step 2: Complete Profile</h3>
              <p className="text-gray-600">
                Add a profile picture, your skills, and interests to help others connect with you easily.
              </p>
            </CardBody>
            <CardFooter className="flex justify-center">
                <Button
                    className="bg-green-600 text-white font-bold hover:bg-green-700"
                    size="sm"
                    onClick={handleCompleteProfileClick}
                >
                    Complete Profile
                </Button>
            </CardFooter>
          </Card>
        </div>
        

        {/* Step 3 - Expanded Start Exploring */}
        <Card isHoverable className="transition-transform hover:scale-105 shadow-lg mt-8">
          <CardHeader className="flex justify-center items-center text-teal-600">
            <FaRocket size={50} />
          </CardHeader>
          <CardBody>
            <h3 className="text-xl font-bold text-center mb-6">Step 3: Start Exploring</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Connect */}
              <Card isHoverable className="shadow-lg">
                <CardHeader className="flex justify-center items-center text-blue-600">
                  <FaUsers size={40} />
                </CardHeader>
                <CardBody className="text-center">
                  <h4 className="text-lg font-bold mb-2">Connect</h4>
                  <p className="text-gray-600">
                    Search for peers, alumni, or mentors using filters like skills, interests, and programs.
                  </p>
                </CardBody>
              </Card>

              {/* Collaborate */}
              <Card isHoverable className="shadow-lg">
                <CardHeader className="flex justify-center items-center text-green-600">
                  <FaHandsHelping size={40} />
                </CardHeader>
                <CardBody className="text-center">
                  <h4 className="text-lg font-bold mb-2">Collaborate</h4>
                  <p className="text-gray-600">
                    Join or post collaborative projects and find like-minded individuals to work with.
                  </p>
                </CardBody>
              </Card>

              {/* Mentorship */}
              <Card isHoverable className="shadow-lg">
                <CardHeader className="flex justify-center items-center text-yellow-600">
                  <FaComments size={40} />
                </CardHeader>
                <CardBody className="text-center">
                  <h4 className="text-lg font-bold mb-2">Mentorship</h4>
                  <p className="text-gray-600">
                    Explore the mentorship portal to find or become a mentor, fostering meaningful guidance.
                  </p>
                </CardBody>
              </Card>

              {/* Opportunities */}
              <Card isHoverable className="shadow-lg">
                <CardHeader className="flex justify-center items-center text-teal-600">
                  <FaBriefcase size={40} />
                </CardHeader>
                <CardBody className="text-center">
                  <h4 className="text-lg font-bold mb-2">Opportunities</h4>
                  <p className="text-gray-600">
                    Browse the job board for internships, jobs, or freelance gigs shared by alumni and companies.
                  </p>
                </CardBody>
              </Card>

              {/* Events */}
              <Card isHoverable className="shadow-lg">
                <CardHeader className="flex justify-center items-center text-purple-600">
                  <FaCalendarAlt size={40} />
                </CardHeader>
                <CardBody className="text-center">
                  <h4 className="text-lg font-bold mb-2">Events</h4>
                  <p className="text-gray-600">
                    Participate in webinars, networking sessions, and competitions to grow your skills and network.
                  </p>
                </CardBody>
              </Card>

              {/* Groups */}
              <Card isHoverable className="shadow-lg">
                <CardHeader className="flex justify-center items-center text-pink-600">
                  <FaUsers size={40} />
                </CardHeader>
                <CardBody className="text-center">
                  <h4 className="text-lg font-bold mb-2">Groups</h4>
                  <p className="text-gray-600">
                    Join or create interest-based groups for discussions, resource sharing, and networking.
                  </p>
                </CardBody>
              </Card>
            </div>
          </CardBody>
          <CardFooter className="flex justify-center">
            <Button className="bg-teal-600 text-white font-bold hover:bg-teal-700" size="lg">
              Start Exploring
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 mt-20">
        <div className="container mx-auto px-6 lg:px-20 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Hear from Our Community
        </h2>
        <p className="text-gray-600 italic">
            &ldquo;LetUsConnect has been instrumental in helping me find the right
            mentors and collaborate on exciting projects.&rdquo;
        </p>
        <p className="text-gray-800 font-bold mt-4">&mdash; Jane Doe</p>
        </div>
      </div>
      {/* Modal */}
      <ModalPopup
        isOpen={showModal}
        title="Complete Step 1 First"
        content="Please register or log in to complete your profile."
        confirmLabel="Register"
        cancelLabel="Close"
        onConfirm={handleModalRegister}
        onCancel={handleCloseModal}
        confirmColor="primary"
        cancelColor="danger"
        showCancelButton
      />
    </section>
  );
}