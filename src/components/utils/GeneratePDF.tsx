"use client";

import React from 'react';
import { PDFDownloadButton } from './convertOptionsToPdf';
import { eventsAuthComponents, eventsNonAuthComponents } from './eventOptions';
import { connectNonAuthComponents, connectAuthComponents } from "./connectStudentOptions";
import { jobsAuthComponents, jobsNonAuthComponents } from "./jobOptions";
import { mentorshipNonAuthComponents, mentorshipAuthComponents } from "./mentorshipOptions";
import { projectsAuthComponents, projectsNonAuthComponents } from "./projectsOptions";
import { testimonialsAuthComponents, testimonialsNonAuthComponents } from "./testimonialOptions";
import { aboutComponents } from "./aboutusmenu";
import { footerComponents } from './footerOptions';

const GeneratePDF: React.FC = () => {
    const componentsList = [eventsAuthComponents, eventsNonAuthComponents,
                            connectAuthComponents, connectNonAuthComponents,
                            jobsAuthComponents, jobsNonAuthComponents,
                            mentorshipAuthComponents, mentorshipNonAuthComponents,
                            projectsAuthComponents, projectsNonAuthComponents,
                            testimonialsAuthComponents, testimonialsNonAuthComponents,
                            aboutComponents, footerComponents
                          ];
    const sectionTitles = ['Events for Authenticated Users', 'Events for Non-Authenticated Users',
                            'Connect students for Authenticated Users', 'Connect students for Non-Authenticated Users',
                            'Jobs options for Authenticated users', 'Jobs options for Non-Authenticated users',
                            'Mentorship options for Authenticated users', 'Mentorship options for Non-Authenticated users',
                            'Projects options for Authenticated users', 'Projects options for Non-Authenticated users',
                            'Testimonials for Authenticated users', 'Testimonials for Non-Authenticated users',
                            'About Us', "Footer map"
                        ];
    
    return (
      <PDFDownloadButton
        componentsList={componentsList}
        fileName="project-description-context"
        sectionTitles={sectionTitles}
        existingPdfPath="/assets/ProjectDescription-2.pdf"
      />
    );
  };

export default GeneratePDF;