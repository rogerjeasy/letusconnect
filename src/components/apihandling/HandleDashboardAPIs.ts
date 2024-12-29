import { api, handleError } from "@/helpers/api";
import { toast } from "react-toastify";

interface ProfileCompletion {
  completionPercentage: number;
  filledFields: number;
  totalFields: number;
  missingFields: string[];
  profileStatus: string;
}

/**
 * Function to fetch profile completion details.
 * @param token - The user authorization token.
 * @returns A promise that resolves to the profile completion data.
 */
export const handleProfileCompletion = async (
  token: string
): Promise<ProfileCompletion | null> => {
  try {
    const response = await api.get("/api/users/completion", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    // Handle general errors
    const errorMessage = handleError(error);
    toast.error(errorMessage || "Failed to fetch profile completion status");
    return null;
  }
};

// Example usage in a React component:
/*
const ProfileCompletionComponent: React.FC = () => {
  const [completionData, setCompletionData] = useState<ProfileCompletion | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCompletion = async () => {
      if (token) {
        const data = await handleProfileCompletion(token);
        if (data) {
          setCompletionData(data);
        }
      }
    };

    fetchCompletion();
  }, [token]);

  if (!completionData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile Completion: {completionData.completionPercentage}%</h2>
      <p>Status: {completionData.profileStatus}</p>
      <p>
        Completed {completionData.filledFields} out of {completionData.totalFields} fields
      </p>
      {completionData.missingFields.length > 0 && (
        <div>
          <h3>Missing Fields:</h3>
          <ul>
            {completionData.missingFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
*/