import { motion } from "framer-motion";
import { FaRocket, FaUsers, FaLightbulb, FaShieldAlt } from "react-icons/fa";
import Container from "../components/Container";

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md border border-slate-100 p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden shadow-xl shadow-slate-200/50"
    >
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
        <div className="relative z-10 text-blue-600 text-3xl mb-4 flex justify-center w-14 h-14 bg-blue-50 rounded-2xl mx-auto items-center">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-center">{description}</p>
    </motion.div>
);

const About = () => {
    return (
        <div className="min-h-screen bg-[#fdfeff] text-slate-900 relative overflow-hidden">
            {/* Soft Background Animated Blobs */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-5%] w-[35%] h-[35%] bg-indigo-50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 pointer-events-none" />
            <div className="absolute top-[40%] left-[20%] w-[30%] h-[30%] bg-pink-50 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-4000 pointer-events-none" />

            <Container className="relative z-10 py-24">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-24"
                    >
                        <motion.span
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-black tracking-widest uppercase rounded-full mb-6"
                        >
                            Our Journey
                        </motion.span>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight text-slate-900">
                            Redefining the <span className="text-blue-600">Shopping Experience.</span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
                            At Click2Buy, we're more than just an e-commerce platform. We're a community dedicated to bringing quality, innovation, and style to your doorstep.
                        </p>
                    </motion.div>

                    {/* Mission Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[2.5rem] blur opacity-50 transition duration-1000"></div>
                            <div className="relative bg-white/70 backdrop-blur-2xl border border-white/40 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-blue-500/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-1.5 h-10 bg-blue-600 rounded-full"></div>
                                    <h2 className="text-3xl font-black text-slate-900">Our Mission</h2>
                                </div>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    To empower individuals through accessibility to premium products and cutting-edge technology. We strive to create a seamless shopping ecosystem that values customer satisfaction above all else.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-[2.5rem] blur opacity-50 transition duration-1000"></div>
                            <div className="relative bg-white/70 backdrop-blur-2xl border border-white/40 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-1.5 h-10 bg-indigo-600 rounded-full"></div>
                                    <h2 className="text-3xl font-black text-slate-900">Our Vision</h2>
                                </div>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    To become the global leader in digital retail by fostering innovation, sustainability, and unparalleled customer experiences that inspire modern living.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Core Values */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900 mb-4">Values that Drive Us</h2>
                        <p className="text-slate-500">The foundation of every decision we make.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={FaRocket}
                            title="Innovation"
                            description="Constantly pushing boundaries to improve your shopping experience."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={FaUsers}
                            title="Community"
                            description="Building lasting relationships with our customers and partners."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={FaLightbulb}
                            title="Quality"
                            description="Curating only the best products for our discerning audience."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={FaShieldAlt}
                            title="Trust"
                            description="Ensuring security and transparency in every transaction."
                            delay={0.4}
                        />
                    </div>

                    {/* Call to Action */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-32 text-center bg-gradient-to-r from-blue-600 to-indigo-700 py-16 px-8 rounded-[3rem] shadow-2xl shadow-blue-500/20"
                    >
                        <h2 className="text-4xl font-black text-white mb-6">Join Our Growing Community</h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                            Experience the future of retail today. Discover our latest collections and be part of our story.
                        </p>
                        <motion.a
                            href="/shop"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block bg-white text-blue-600 font-bold px-10 py-4 rounded-2xl shadow-xl hover:bg-slate-50 transition-colors"
                        >
                            Start Shopping
                        </motion.a>
                    </motion.div>
                </div>
            </Container>
        </div>
    );
};

export default About;
