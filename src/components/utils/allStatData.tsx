interface PlatformMetrics {
    activeUsers: {
      daily: number;
      weekly: number;
      monthly: number;
      yearlyGrowth: number;
    };
    engagementRates: {
      eventParticipation: number;
      mentorshipCompletion: number;
      projectCollaboration: number;
      communityInteraction: number;
    };
    userSatisfaction: {
      overall: number;
      mentorship: number;
      events: number;
      resources: number;
      networking: number;
    };
  }
  
  interface CareerImpact {
    jobPlacements: Array<{
      year: number;
      count: number;
      industryType: string;
      averageSalary: number;
    }>;
    salaryIncrease: {
      averagePercentage: number;
      medianIncrease: number;
      topPerformers: number;
    };
    promotions: {
      sixMonths: number;
      oneYear: number;
      twoYears: number;
    };
  }
  
  interface AcademicMetrics {
    researchOutput: {
      publications: number;
      citations: number;
      patents: number;
      awards: number;
    };
    collaborations: {
      universityPartnerships: number;
      industryPartnerships: number;
      researchGrants: number;
      jointPrograms: number;
    };
    studentSuccess: {
      graduationRate: number;
      continuedEducation: number;
      scholarships: number;
    };
  }
  
  interface MentorshipStats {
    activeMentors: number;
    totalSessions: number;
    averageRating: number;
    successStories: number;
    industryExperts: number;
    mentorshipHours: number;
  }
  
  interface ProjectCollaborations {
    activeProjects: number;
    completedProjects: number;
    successRate: number;
    teamSize: {
      average: number;
      max: number;
      min: number;
    };
    categories: Array<{
      name: string;
      count: number;
      successRate: number;
    }>;
  }
  
  interface GeographicReach {
    countries: number;
    cities: number;
    regions: Array<{
      name: string;
      users: number;
      projects: number;
    }>;
    internationalCollaborations: number;
  }
  
  interface SkillDevelopment {
    coursesCompleted: number;
    certificationsEarned: number;
    skillsTracked: Array<{
      name: string;
      proficiency: number;
      demand: number;
    }>;
    workshopAttendance: number;
  }
  
  interface InnovationMetrics {
    startups: {
      launched: number;
      fundingRaised: number;
      successfulExits: number;
      activeIncubation: number;
    };
    patents: {
      filed: number;
      granted: number;
      pending: number;
      commercialized: number;
    };
    innovations: {
      products: number;
      services: number;
      technologies: number;
    };
  }
  
  interface EventMetrics {
    totalEvents: number;
    categories: {
      workshops: number;
      seminars: number;
      networkingSessions: number;
      hackathons: number;
      careerFairs: number;
    };
    participation: {
      averageAttendance: number;
      satisfaction: number;
      repeatAttendees: number;
    };
  }
  
  interface CommunityEngagement {
    activeDiscussions: number;
    resourceShared: number;
    peerSupport: {
      questionsAsked: number;
      answersProvided: number;
      solutionRate: number;
    };
    userGroups: {
      total: number;
      active: number;
      members: number;
    };
  }
  
  interface MonthlyTrends {
    userGrowth: Array<{ 
      month: string; 
      users: number; 
    }>;
    engagement: Array<{ 
      month: string; 
      events: number; 
      mentoring: number; 
      workshops: number;
    }>;
    projectGrowth: Array<{
      month: string;
      academic: number;
      industry: number;
      research: number;
    }>;
  }
  
  interface StatsCategories {
    platformMetrics: PlatformMetrics;
    careerImpact: CareerImpact;
    academicMetrics: AcademicMetrics;
    mentorshipStats: MentorshipStats;
    projectCollaborations: ProjectCollaborations;
    geographicReach: GeographicReach;
    skillDevelopment: SkillDevelopment;
    innovationMetrics: InnovationMetrics;
    eventMetrics: EventMetrics;
    communityEngagement: CommunityEngagement;
    monthlyTrends: MonthlyTrends;
  }
  
  type StatCategory = keyof StatsCategories;
  type MonthlyTrendMetric = keyof MonthlyTrends;
  
  export const allStats = {
    platformMetrics: {
      activeUsers: {
        daily: 1200,
        weekly: 5000,
        monthly: 15000,
        yearlyGrowth: 25
      },
      engagementRates: {
        eventParticipation: 78,
        mentorshipCompletion: 85,
        projectCollaboration: 72,
        communityInteraction: 68
      },
      userSatisfaction: {
        overall: 4.8,
        mentorship: 4.9,
        events: 4.7,
        resources: 4.6,
        networking: 4.8
      }
    },
  
    careerImpact: {
      jobPlacements: [
        { year: 2023, count: 850, industryType: "Tech", averageSalary: 95000 },
        { year: 2023, count: 420, industryType: "Finance", averageSalary: 88000 },
        { year: 2023, count: 380, industryType: "Consulting", averageSalary: 92000 },
        { year: 2023, count: 290, industryType: "Healthcare", averageSalary: 86000 }
      ],
      salaryIncrease: {
        averagePercentage: 35,
        medianIncrease: 25000,
        topPerformers: 55
      },
      promotions: {
        sixMonths: 180,
        oneYear: 420,
        twoYears: 680
      }
    },
  
    academicMetrics: {
      researchOutput: {
        publications: 120,
        citations: 2800,
        patents: 25,
        awards: 45
      },
      collaborations: {
        universityPartnerships: 15,
        industryPartnerships: 75,
        researchGrants: 28,
        jointPrograms: 12
      },
      studentSuccess: {
        graduationRate: 94,
        continuedEducation: 45,
        scholarships: 220
      }
    },
  
    mentorshipStats: {
      activeMentors: 500,
      totalSessions: 12000,
      averageRating: 4.8,
      successStories: 350,
      industryExperts: 180,
      mentorshipHours: 25000
    },
  
    projectCollaborations: {
      activeProjects: 400,
      completedProjects: 1200,
      successRate: 92,
      teamSize: {
        average: 4.5,
        max: 12,
        min: 2
      },
      categories: [
        { name: "Research", count: 180, successRate: 94 },
        { name: "Industry", count: 150, successRate: 88 },
        { name: "Innovation", count: 120, successRate: 90 },
        { name: "Social Impact", count: 100, successRate: 95 }
      ]
    },
  
    geographicReach: {
      countries: 40,
      cities: 120,
      regions: [
        { name: "North America", users: 1200, projects: 150 },
        { name: "Europe", users: 800, projects: 120 },
        { name: "Asia", users: 600, projects: 80 },
        { name: "Others", users: 400, projects: 50 }
      ],
      internationalCollaborations: 280
    },
  
    skillDevelopment: {
      coursesCompleted: 15000,
      certificationsEarned: 8500,
      skillsTracked: [
        { name: "Data Science", proficiency: 85, demand: 92 },
        { name: "AI/ML", proficiency: 80, demand: 95 },
        { name: "Analytics", proficiency: 90, demand: 88 },
        { name: "Programming", proficiency: 75, demand: 85 },
        { name: "Research", proficiency: 70, demand: 75 },
        { name: "Business", proficiency: 65, demand: 80 }
      ],
      workshopAttendance: 25000
    },
  
    innovationMetrics: {
      startups: {
        launched: 30,
        fundingRaised: 5000000,
        successfulExits: 5,
        activeIncubation: 15
      },
      patents: {
        filed: 25,
        granted: 18,
        pending: 7,
        commercialized: 10
      },
      innovations: {
        products: 45,
        services: 35,
        technologies: 28
      }
    },
  
    eventMetrics: {
      totalEvents: 300,
      categories: {
        workshops: 120,
        seminars: 80,
        networkingSessions: 60,
        hackathons: 15,
        careerFairs: 25
      },
      participation: {
        averageAttendance: 85,
        satisfaction: 4.7,
        repeatAttendees: 65
      }
    },
  
    communityEngagement: {
      activeDiscussions: 1500,
      resourceShared: 3500,
      peerSupport: {
        questionsAsked: 12000,
        answersProvided: 48000,
        solutionRate: 92
      },
      userGroups: {
        total: 180,
        active: 150,
        members: 12000
      }
    },
  
    monthlyTrends: {
      userGrowth: [
        { month: "Jan", users: 12000 },
        { month: "Feb", users: 13200 },
        { month: "Mar", users: 14500 },
        { month: "Apr", users: 15800 },
        { month: "May", users: 17200 },
        { month: "Jun", users: 18500 }
      ],
      engagement: [
        { month: "Jan", events: 45, mentoring: 80, workshops: 30 },
        { month: "Feb", events: 50, mentoring: 85, workshops: 35 },
        { month: "Mar", events: 55, mentoring: 90, workshops: 40 },
        { month: "Apr", events: 60, mentoring: 95, workshops: 45 },
        { month: "May", events: 65, mentoring: 100, workshops: 50 },
        { month: "Jun", events: 70, mentoring: 105, workshops: 55 }
      ],
      projectGrowth: [
        { month: "Jan", academic: 20, industry: 15, research: 10 },
        { month: "Feb", academic: 25, industry: 18, research: 12 },
        { month: "Mar", academic: 30, industry: 22, research: 15 },
        { month: "Apr", academic: 35, industry: 25, research: 18 },
        { month: "May", academic: 40, industry: 30, research: 22 },
        { month: "Jun", academic: 45, industry: 35, research: 25 }
      ]
    }
  };
  
  export const getStatsByCategory = <T extends StatCategory>(category: T): StatsCategories[T] | null => {
    return allStats[category] || null;
  };
  
  export const getMonthlyTrend = <T extends MonthlyTrendMetric>(metric: T): MonthlyTrends[T] | null => {
    return allStats.monthlyTrends[metric] || null;
  };
  
  interface TopPerformer {
    id: string;
    name: string;
    score: number;
    category: string;
  }
  
  export const calculateGrowth = (current: number, previous: number): number => {
    return ((current - previous) / previous) * 100;
  };

  export const getTopPerformers = (category: StatCategory, limit: number = 5): TopPerformer[] => {
    const performers: TopPerformer[] = [];

    let mentorScore: number;
    let eventCategories: void;
    let satisfactionScores: void;
  
    switch (category) {
      case 'careerImpact':
        // Get top performers by salary
        allStats.careerImpact.jobPlacements
          .sort((a, b) => b.averageSalary - a.averageSalary)
          .slice(0, limit)
          .forEach((placement, index) => {
            performers.push({
              id: `salary-${index}`,
              name: placement.industryType,
              score: placement.averageSalary,
              category: 'Highest Salary'
            });
          });
        break;
  
      case 'academicMetrics':
        // Get top research contributors based on citations
        performers.push({
          id: 'research-1',
          name: 'Research Publications',
          score: allStats.academicMetrics.researchOutput.publications,
          category: 'Academic Achievement'
        });
        performers.push({
          id: 'research-2',
          name: 'Citations',
          score: allStats.academicMetrics.researchOutput.citations,
          category: 'Academic Impact'
        });
        break;
  
      case 'projectCollaborations':
        // Get top project categories by success rate
        allStats.projectCollaborations.categories
          .sort((a, b) => b.successRate - a.successRate)
          .slice(0, limit)
          .forEach((category, index) => {
            performers.push({
              id: `project-${index}`,
              name: category.name,
              score: category.successRate,
              category: 'Project Success Rate'
            });
          });
        break;
  
      case 'skillDevelopment':
        // Get top skills by demand
        allStats.skillDevelopment.skillsTracked
          .sort((a, b) => b.demand - a.demand)
          .slice(0, limit)
          .forEach((skill, index) => {
            performers.push({
              id: `skill-${index}`,
              name: skill.name,
              score: skill.demand,
              category: 'Most In-Demand Skills'
            });
          });
        break;
  
      case 'innovationMetrics':
        // Get top innovations by commercialization
        performers.push({
          id: 'innovation-1',
          name: 'Successful Startups',
          score: allStats.innovationMetrics.startups.successfulExits,
          category: 'Innovation Success'
        });
        performers.push({
          id: 'innovation-2',
          name: 'Commercialized Patents',
          score: allStats.innovationMetrics.patents.commercialized,
          category: 'Innovation Impact'
        });
        break;
  
      case 'geographicReach':
        // Get top regions by user engagement
        allStats.geographicReach.regions
          .sort((a, b) => b.users - a.users)
          .slice(0, limit)
          .forEach((region, index) => {
            performers.push({
              id: `region-${index}`,
              name: region.name,
              score: region.users,
              category: 'Regional Engagement'
            });
          });
        break;
  
        case 'mentorshipStats':
            // Now using the pre-declared variable
            mentorScore = allStats.mentorshipStats.totalSessions * 
                               allStats.mentorshipStats.averageRating;
            performers.push({
              id: 'mentor-1',
              name: 'Mentor Effectiveness',
              score: mentorScore,
              category: 'Mentorship Impact'
            });
            break;
  
      case 'communityEngagement':
        // Get top engagement metrics
        performers.push({
          id: 'engagement-1',
          name: 'Active Discussions',
          score: allStats.communityEngagement.activeDiscussions,
          category: 'Community Activity'
        });
        performers.push({
          id: 'engagement-2',
          name: 'Solution Rate',
          score: allStats.communityEngagement.peerSupport.solutionRate,
          category: 'Community Support'
        });
        break;
  
        case 'eventMetrics':
            // Now using the pre-declared variable
            eventCategories = Object.entries(allStats.eventMetrics.categories)
              .map(([name, count]) => ({ name, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, limit)
              .forEach((event, index) => {
                performers.push({
                  id: `event-${index}`,
                  name: event.name,
                  score: event.count,
                  category: 'Event Popularity'
                });
              });
            break;

      case 'platformMetrics':
      // Now using the pre-declared variable
      satisfactionScores = Object.entries(allStats.platformMetrics.userSatisfaction)
        .map(([name, score]) => ({ name, score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .forEach((metric, index) => {
          performers.push({
            id: `satisfaction-${index}`,
            name: metric.name,
            score: metric.score,
            category: 'User Satisfaction'
          });
        });
      break;
  
      default:
        // Return empty array for unknown categories
        return performers;
    }
  
    // Ensure we don't return more than the limit
    return performers.slice(0, limit);
  };