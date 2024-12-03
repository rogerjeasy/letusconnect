import React, { useState, useEffect } from "react";
import SpinnerUI from "../forms/SpinnerUI";

interface University {
  country: string;
  name: string;
  state_province: string | null;
  alpha_two_code: string;
  web_pages: string[];
  domains: string[];
}

const UniversityList: React.FC<{ country: string }> = ({ country }) => {
  const [universities, setUniversities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://universities.hipolabs.com/search?country=${country.toLowerCase()}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch universities");
        }

        const data: University[] = await response.json();
        const universityNames = data.map((university) => university.name);
        setUniversities(universityNames);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, [country]);

  if (loading) {
    return <SpinnerUI label={`Fetching universities for ${country}...`} />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Universities in {country}</h2>
      <ul>
        {universities.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UniversityList;