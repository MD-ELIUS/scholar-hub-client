import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronDown } from "react-icons/io5";
import { FaQ, FaQq } from "react-icons/fa6";

const faqs = [
  {
    q: "What is ScholarHub and how does it work?",
    a: "ScholarHub is a centralized scholarship management platform where students can explore verified scholarship opportunities, submit applications online, complete payments securely, and track application status from a personalized dashboard."
  },
  {
    q: "Is the scholarship application fee refundable?",
    a: "No. Application and service fees are non-refundable once the payment process is completed, even if an application is withdrawn or rejected, as the fee covers processing and administrative costs."
  },
  {
    q: "Can I apply for more than one scholarship at the same time?",
    a: "Yes. You can apply for multiple scholarships simultaneously as long as you meet the eligibility criteria specified for each scholarship."
  },
  {
    q: "How can I track the status of my applications?",
    a: "After submitting an application, you can track its progress in real time from your dashboard under the “My Applications” section, including payment status and review updates."
  },
  {
    q: "Are payments and personal information secure on ScholarHub?",
    a: "Absolutely. All payments are processed through Stripe, a globally trusted payment gateway, and your personal information is protected using industry-standard security and encryption practices."
  }
];

const Faq = () => {
  const [open, setOpen] = useState(null);

  return (
    <section className="w-11/12 mx-auto mt-10 scroll-mt-24 ">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center mb-8  flex justify-center items-center gap-3 md:gap-5"
      >
        <FaQq className="text-secondary mt-1 hidden md:flex" />
        Frequently Asked Questions
      </motion.h2>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
        {faqs.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-secondary/40 rounded-bl-2xl rounded-tr-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            {/* Question */}
            <button
              onClick={() => setOpen(open === index ? null : index)}
              className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-lef cursor-pointer"
            >
              <span className="text-primary font-semibold text-sm md:text-base lg:text-lg leading-snug">
                {item.q}
              </span>

              <motion.span
                animate={{ rotate: open === index ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="text-secondary text-lg sm:text-xl flex-shrink-0"
              >
                <IoChevronDown />
              </motion.span>
            </button>

            {/* Answer */}
            <AnimatePresence>
              {open === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 sm:px-6 pb-4 sm:pb-5 text-gray-600 text-sm sm:text-base leading-relaxed">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
