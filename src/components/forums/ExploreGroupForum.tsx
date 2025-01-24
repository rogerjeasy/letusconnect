"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  Rocket, 
  Network, 
  Code,
  Briefcase,
  GraduationCap,
  Users,
  Beaker,
  Filter,
  X,
  Globe,
  BookMarked,
  Lightbulb
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// TypeScript interfaces
interface Category {
  name: string;
  count: number;
  description: string;
  imageUrl: string;
  icon: JSX.Element;
  bgColor: string;
}

interface Topic {
  name: string;
  color: string;
}

type ActivityLevel = 'Very Active' | 'Active' | 'Moderate' | 'New';

interface Group {
  name: string;
  members: number;
  topics: Topic[];
  activity: ActivityLevel;
  imageUrl: string;
  description: string;
}

interface AppliedFilter {
  type: 'category' | 'activity' | 'size';
  value: string;
}

// For actual implementation, replace these URLs with your hosted images
const IMAGE_URLS = {
    academic: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80",
    tech: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80",
    data: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    professional: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    innovation: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    research: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    collaboration: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    global: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
  } as const;
  

const ExploreGroupsPage: React.FC = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

  // Category definitions
  const categories: Category[] = [
    {
      name: "Academic Research",
      count: 45,
      description: "Join research groups, collaborate on papers, and engage in scholarly discussions",
      imageUrl: IMAGE_URLS.academic,
      icon: <GraduationCap className="h-8 w-8 text-blue-600" />,
      bgColor: "from-blue-500/20"
    },
    {
      name: "Tech & Programming",
      count: 38,
      description: "Connect with developers, share code, and explore new technologies",
      imageUrl: IMAGE_URLS.tech,
      icon: <Code className="h-8 w-8 text-green-600" />,
      bgColor: "from-green-500/20"
    },
    {
      name: "Data Science",
      count: 32,
      description: "Explore data analysis, machine learning, and AI applications",
      imageUrl: IMAGE_URLS.data,
      icon: <Beaker className="h-8 w-8 text-purple-600" />,
      bgColor: "from-purple-500/20"
    },
    {
      name: "Professional Skills",
      count: 29,
      description: "Develop career skills, leadership, and industry expertise",
      imageUrl: IMAGE_URLS.professional,
      icon: <Briefcase className="h-8 w-8 text-orange-600" />,
      bgColor: "from-orange-500/20"
    }
  ];

  // Featured groups
  const featuredGroups: Group[] = [
    {
      name: "Data Science Innovation Lab",
      members: 234,
      topics: [
        { name: "Machine Learning", color: "blue" },
        { name: "AI", color: "purple" },
        { name: "Big Data", color: "green" }
      ],
      activity: "Very Active",
      imageUrl: IMAGE_URLS.data,
      description: "Cutting-edge research and applications in data science"
    },
    {
      name: "Global Tech Network",
      members: 189,
      topics: [
        { name: "Cloud Computing", color: "blue" },
        { name: "DevOps", color: "orange" },
        { name: "Architecture", color: "green" }
      ],
      activity: "Active",
      imageUrl: IMAGE_URLS.tech,
      description: "International technology collaboration and knowledge sharing"
    },
    {
      name: "Research Accelerator",
      members: 156,
      topics: [
        { name: "Publications", color: "purple" },
        { name: "Research", color: "blue" },
        { name: "Methodology", color: "green" }
      ],
      activity: "Very Active",
      imageUrl: IMAGE_URLS.research,
      description: "Accelerate your research through collaboration"
    }
  ];

  const activityLevels: ActivityLevel[] = ["Very Active", "Active", "Moderate", "New"];
  const groupSizes: string[] = ["Small (< 50)", "Medium (50-200)", "Large (> 200)"];

  const handleAddFilter = (type: AppliedFilter['type'], value: string): void => {
    if (value && !appliedFilters.find(f => f.value === value)) {
      setAppliedFilters([...appliedFilters, { type, value }]);
    }
  };

  const handleRemoveFilter = (filterToRemove: AppliedFilter): void => {
    setAppliedFilters(appliedFilters.filter(f => f.value !== filterToRemove.value));
    switch (filterToRemove.type) {
      case 'category':
        setSelectedCategory('');
        break;
      case 'activity':
        setSelectedActivity('');
        break;
      case 'size':
        setSelectedSize('');
        break;
    }
  };

  const handleSearch = (): void => {
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 p-4 md:p-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Discover Your Community
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join groups and forums that match your interests. Connect with fellow students, share knowledge, and grow together.
        </p>
        
        {/* Search and Filters */}
        <div className="max-w-6xl mx-auto mb-8">
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search groups or topics..." 
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>

          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Select 
              value={selectedCategory} 
              onValueChange={(value) => {
                setSelectedCategory(value);
                handleAddFilter('category', value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedActivity} 
              onValueChange={(value) => {
                setSelectedActivity(value);
                handleAddFilter('activity', value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Activity Level" />
              </SelectTrigger>
              <SelectContent>
                {activityLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedSize} 
              onValueChange={(value) => {
                setSelectedSize(value);
                handleAddFilter('size', value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Group Size" />
              </SelectTrigger>
              <SelectContent>
                {groupSizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          {/* Applied Filters */}
          {appliedFilters.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-2 mt-4"
            >
              {appliedFilters.map((filter) => (
                <Badge 
                  key={filter.value}
                  variant="secondary"
                  className="px-3 py-1 flex items-center gap-2"
                >
                  {filter.value}
                  <X 
                    className="h-4 w-4 cursor-pointer hover:text-red-500" 
                    onClick={() => handleRemoveFilter(filter)}
                  />
                </Badge>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Categories Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <motion.div
              key={category.name}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="cursor-pointer h-full relative overflow-hidden group">
                <CardHeader className="relative p-0">
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.bgColor} to-transparent z-10`} />
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    {category.icon}
                  </div>
                  <div className="absolute bottom-4 left-4 z-20 text-white">
                    <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-white/80">{category.count} groups</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Featured Groups Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-semibold mb-6">Featured Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGroups.map((group) => (
            <motion.div
              key={group.name}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="cursor-pointer h-full">
                <CardHeader>
                  <img 
                    src={group.imageUrl} 
                    alt={group.name}
                    className="rounded-t-lg h-48 w-full object-cover mb-4"
                  />
                  <CardTitle>{group.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {group.members} members • {group.activity}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{group.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.topics.map(topic => (
                      <Badge 
                        key={topic.name}
                        variant="secondary"
                        className={`bg-${topic.color}-100 text-${topic.color}-800`}
                      >
                        {topic.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ExploreGroupsPage;