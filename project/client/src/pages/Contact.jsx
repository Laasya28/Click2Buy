import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaRegPaperPlane } from "react-icons/fa";
import Container from "../components/Container";

const ContactCard = ({ icon: Icon, title, content, subContent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className="bg-white/80 backdrop-blur-md border border-slate-100 p-8 rounded-[2rem] text-center hover:shadow-2xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden shadow-xl shadow-slate-200/50"
  >
    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
    <div className="relative z-10 text-blue-600 text-3xl mb-4 flex justify-center w-14 h-14 bg-blue-50 rounded-2xl mx-auto items-center">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <div className="text-slate-600 font-medium mb-1">{content}</div>
    {subContent && <div className="text-slate-400 text-xs uppercase tracking-widest font-bold">{subContent}</div>}
  </motion.div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    messages: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.clientName || !formData.email || !formData.messages) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Message sent successfully!");
        setFormData({ clientName: "", email: "", messages: "" });
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfeff] text-slate-900 relative overflow-hidden">
      {/* Soft Background Animated Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[35%] h-[35%] bg-indigo-50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-pink-50 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-4000 pointer-events-none" />

      <Container className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900">
              Contact <span className="text-blue-600">Us</span>
            </h1>
          </motion.div>

          {/* Main Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Info Column */}
            <div className="lg:col-span-4 grid grid-cols-1 gap-6">
              <ContactCard
                icon={FaEnvelope}
                title="Email Support"
                content="click2buy@support.com"
                subContent="Expert help in 24h"
                delay={0.1}
              />
              <ContactCard
                icon={FaPhone}
                title="Direct Call"
                content="+91 98765 43210"
                subContent="Mon - Sat, 9am - 6pm"
                delay={0.2}
              />
              <ContactCard
                icon={FaMapMarkerAlt}
                title="Our Studio"
                content="Silicon Valley, Sector 4, Bangalore, KA - 560001"
                subContent="The Heart of Innovation"
                delay={0.3}
              />
            </div>

            {/* Form Column */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-8 relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative bg-white/70 backdrop-blur-2xl border border-white/40 p-8 md:p-16 rounded-[2.5rem] h-full shadow-2xl shadow-blue-500/5">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-1.5 h-10 bg-blue-600 rounded-full"></div>
                  <h2 className="text-3xl font-black text-slate-900">Send an Inquiry</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-5 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-5 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-700 ml-1">How can we assist you?</label>
                    <textarea
                      name="messages"
                      value={formData.messages}
                      onChange={handleChange}
                      placeholder="Share the details of your request..."
                      rows="5"
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-6 py-5 outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-900 placeholder:text-slate-400 font-medium resize-none"
                    ></textarea>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-6 rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span className="text-lg">Send Message</span>
                        <FaRegPaperPlane className="text-lg" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Contact;





