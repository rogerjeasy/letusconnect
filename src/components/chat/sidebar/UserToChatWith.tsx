import { useEffect, useState, useMemo } from "react";
import { User } from "@/store/userStore";
import { getAllUsers } from "@/services/users.services";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Briefcase, MessageSquare } from "lucide-react";
import { Skill, getAllSkills } from "@/store/skills";
import debounce from "lodash/debounce";

interface UserToChatWithProps {
  trigger?: React.ReactNode;
  onUserSelect?: (user: User) => void;
  currentUserId?: string;
}

type UserRole = 'user' | 'staff' | 'lecture' | 'mentor';
type MentorshipStatus = 'Looking for mentor' | 'Willing to mentor' | 'None';

interface Filters {
  role: UserRole | null;
  mentorship: MentorshipStatus | null;
  skill: Skill | null;
  language: string | null;
}

interface FilterOptions {
  roles: UserRole[];
  mentorship: MentorshipStatus[];
  skills: Skill[];
  languages: string[];
}

const DEFAULT_ROLES: UserRole[] = ['user', 'staff', 'lecture', 'mentor'];
const DEFAULT_MENTORSHIP: MentorshipStatus[] = ['Looking for mentor', 'Willing to mentor', 'None'];

export const UserToChatWith = ({ 
  trigger, 
  onUserSelect,
  currentUserId 
}: UserToChatWithProps) => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    role: null,
    mentorship: null,
    skill: null,
    language: null
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getAllUsers();
        const filteredUsers = currentUserId 
          ? (fetchedUsers ?? []).filter(user => user?.uid !== currentUserId)
          : (fetchedUsers ?? []);
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [open, currentUserId]);

  // Extract filter options from users
  const filterOptions = useMemo<FilterOptions>(() => {
    const allSkills = getAllSkills();
    const languages = new Set<string>();
    const userRoles = new Set<UserRole>();

    (users ?? []).forEach(user => {
      // Safely handle roles
      if (user && Array.isArray(user.role)) {
        user.role.forEach(role => {
          if (DEFAULT_ROLES.includes(role as UserRole)) {
            userRoles.add(role as UserRole);
          }
        });
      }

      // Safely handle languages
      if (user && Array.isArray(user.languages)) {
        user.languages.forEach(lang => {
          if (typeof lang === 'string') {
            languages.add(lang);
          }
        });
      }
    });

    return {
      roles: Array.from(userRoles),
      mentorship: DEFAULT_MENTORSHIP,
      skills: allSkills,
      languages: Array.from(languages)
    };
  }, [users]);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return (users ?? []).filter(user => {
      if (!user) return false;

      const matchesSearch = searchQuery.toLowerCase() === "" || 
        (user.firstName?.toLowerCase()?.includes(searchQuery.toLowerCase()) ?? false) ||
        (user.lastName?.toLowerCase()?.includes(searchQuery.toLowerCase()) ?? false) ||
        (user.username?.toLowerCase()?.includes(searchQuery.toLowerCase()) ?? false);

      const matchesRole = !filters.role || 
        (Array.isArray(user.role) && user.role.includes(filters.role));

      const matchesMentorship = !filters.mentorship ||
        (filters.mentorship === 'Looking for mentor' && user.lookingForMentor === true) ||
        (filters.mentorship === 'Willing to mentor' && user.willingToMentor === true) ||
        (filters.mentorship === 'None' && !user.lookingForMentor && !user.willingToMentor);

      const matchesSkill = !filters.skill ||
        (Array.isArray(user.skills) && user.skills.some(userSkill => userSkill === filters.skill));

      const matchesLanguage = !filters.language ||
        (Array.isArray(user.languages) && user.languages.includes(filters.language));

      return matchesSearch && matchesRole && matchesMentorship && 
        matchesSkill && matchesLanguage;
    });
  }, [users, searchQuery, filters]);

  const handleSearchChange = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const handleUserSelect = (user: User) => {
    onUserSelect?.(user);
    setOpen(false);
  };

  const renderUserCard = (user: User) => {
    if (!user) return null;

    return (
      <div
        key={user.uid}
        className="p-4 hover:bg-gray-50 rounded-lg cursor-pointer"
        onClick={() => handleUserSelect(user)}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profilePicture ?? ""} />
            <AvatarFallback>
              {(user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? user.username?.[0] ?? "")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
                <p className="font-medium truncate">
                    {user.firstName || user.lastName 
                        ? `${user.firstName || ''} ${user.lastName || ''}`.trim() 
                        : user.username}
                </p>
              {Array.isArray(user.role) && user.role.map((role) => (
                <Badge key={role} variant="secondary" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Briefcase className="h-3 w-3" />
              <span className="truncate">{user.currentJobTitle ?? "No job title"}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Chat with User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] flex flex-col mx-4 my-4">
        <DialogHeader>
          <DialogTitle>Select User to Chat With</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 min-h-0">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <Select
                value={filters.role ?? "all"}
                onValueChange={(value: string) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    role: value === "all" ? null : value as UserRole 
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {filterOptions.roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.mentorship ?? "all"}
                onValueChange={(value: string) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    mentorship: value === "all" ? null : value as MentorshipStatus 
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mentorship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Mentorship</SelectItem>
                  {filterOptions.mentorship.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.skill ?? "all"}
                onValueChange={(value: string) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    skill: value === "all" ? null : value as Skill 
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {filterOptions.skills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.language ?? "all"}
                onValueChange={(value: string) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    language: value === "all" ? null : value 
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {filterOptions.languages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Users List */}
          <ScrollArea className="flex-1 h-[400px]">
            <div className="space-y-2">
              {loading ? (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  Loading users...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <Users className="h-8 w-8 mb-2 opacity-50" />
                  <p>No users found</p>
                </div>
              ) : (
                filteredUsers.map((user) => renderUserCard(user))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};