"use client";
import React, { useState, useEffect } from "react";
import { api, handleError } from "@/helpers/api";
import ModalPopup from "@/components/forms/ModalPopup";
import { useSpring, animated } from "@react-spring/web";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
} from "@nextui-org/react";
import { getNewsletterSubscriberCount, subscribeToNewsletter } from "@/services/newsletter.service";

const NewsLetter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalSubscribers, setTotalSubscribers] = useState(0);

  useEffect(() => {
    fetchTotalSubscribers();
  }, []);

  const fetchTotalSubscribers = async () => {
    try {
      const count = await getNewsletterSubscriberCount();
      setTotalSubscribers(count);
    } catch (error) {
      console.error("Failed to fetch total subscribers:", error);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await subscribeToNewsletter(email);

      setStatus("success");
      setMessage("🎉 Thank you for subscribing to our newsletter!");
      setIsModalOpen(true);
      setEmail("");
      fetchTotalSubscribers();
    } catch (error) {
      const errorMessage = handleError(error);
      setStatus("error");
      setMessage(errorMessage || "❌ Something went wrong. Please try again.");
      setIsModalOpen(true);
    } finally {
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const animatedSubscribers = useSpring({
    from: { number: 0 },
    to: { number: totalSubscribers },
    config: { duration: 1000 },
  });

  const isEmailValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <section className="py-12 relative text-white">
      <div className="container mx-auto px-1 flex justify-center items-center">
        <Card className="w-full max-w-screen-xl mx-auto shadow-2xl rounded-xl">
          {/* Card Header */}
          <CardHeader className="flex justify-center bg-white text-black rounded-t-xl py-4">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              📬 Join Our Newsletter
            </h2>
          </CardHeader>

          {/* Card Body */}
          <CardBody className="py-6 text-center space-y-4">
            <p className="text-gray-700 text-lg">
              Stay updated with the latest news, articles, and updates from our
              team.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-wrap gap-4 items-center justify-center px-4"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 min-w-[300px] rounded-lg caret-black"
              />
              <Button
                onClick={handleSubscribe}
                color="primary"
                isDisabled={status === "loading" || !isEmailValid()}
                className="py-3 px-6 font-semibold"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </CardBody>

          {/* Card Footer */}
          <CardFooter className="flex justify-center bg-gray-100 py-4 rounded-b-xl">
            <p className="text-gray-700 text-xl font-semibold">
              🌟 Total Subscribers:{" "}
              <animated.span className="text-blue-600 text-2xl font-bold">
                {animatedSubscribers.number.to((n) => Math.floor(n))}
              </animated.span>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Modal Popup */}
      <ModalPopup
        isOpen={isModalOpen}
        title={status === 'success' ? '🎉 Subscription Successful!' : '❌ Subscription Failed'}
        content={message}
        confirmLabel="Close"
        onConfirm={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        confirmColor={status === 'success' ? 'success' : 'danger'}
        showCancelButton={false}
      />
    </section>
  );
};

export default NewsLetter;