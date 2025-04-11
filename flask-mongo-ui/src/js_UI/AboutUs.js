import React from 'react';
import { FaFlask, FaDatabase, FaCloud, FaReact, FaGithub, FaLinkedin } from 'react-icons/fa';
import '../css/AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-container">
            <div className="about-header">
                <h1>About T3ch Logs</h1>
                <div className="header-underline"></div>
            </div>

            <div className="about-sections">
                <section className="about-section story-section">
                    <h2>Our Story</h2>
                    <p>
                        T Logs was born out of a passion for technology and the need to document 
                        and share knowledge with others. Created by Hemant Kumar, this platform 
                        serves as a digital space for tech enthusiasts, developers, and students 
                        to write, share, and explore blogs on a variety of topics ranging from 
                        programming to cybersecurity.
                    </p>
                </section>

                <section className="about-section vision-section">
                    <h2>Our Vision</h2>
                    <p>
                        We aim to simplify the journey of tech learning by creating a 
                        community-driven platform that values learning through sharing. 
                        Whether it's a bug you fixed, a new tech stack you tried, or a 
                        cybersecurity issue you cracked—T Logs is the place to log it all.
                    </p>
                </section>

                <section className="about-section tech-stack-section">
                    <h2>Tech Stack</h2>
                    <div className="tech-grid">
                        <div className="tech-card">
                            <FaFlask className="tech-icon" />
                            <h3>Flask</h3>
                            <p>Python Web Framework</p>
                        </div>
                        <div className="tech-card">
                            <FaDatabase className="tech-icon" />
                            <h3>MongoDB</h3>
                            <p>NoSQL Database</p>
                        </div>
                        <div className="tech-card">
                            <FaReact className="tech-icon" />
                            <h3>React</h3>
                            <p>Frontend Framework</p>
                        </div>
                        <div className="tech-card">
                            <FaCloud className="tech-icon" />
                            <h3>Cloudinary</h3>
                            <p>Image Management</p>
                        </div>
                    </div>
                </section>

                <section className="about-section creator-section">
                    <h2>Meet the Creator</h2>
                    <div className="creator-content">
                        <div className="creator-info">
                            <h3>Hemant Kumar</h3>
                            <p>Tech Explorer & Cybersecurity Enthusiast</p>
                            <p>
                                T Logs is my project to not just write code, but to write 
                                stories around code. Join me in this journey of tech exploration 
                                and knowledge sharing.
                            </p>
                            <div className="social-links">
                                <a href="https://github.com/mrji421" 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   className="social-link">
                                    <FaGithub /> GitHub
                                </a>
                                <a href="https://linkedin.com/in/hemantkuamr421" 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   className="social-link">
                                    <FaLinkedin /> LinkedIn
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;