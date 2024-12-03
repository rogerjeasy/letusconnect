// Define the type for dropdown options
export interface DropdownOption {
    key: string;
    label: string;
  }
  
  // List of university degrees
  const universityDegrees: DropdownOption[] = [
    { key: "associate", label: "Associate's Degree" },
    { key: "bachelor", label: "Bachelor's Degree" },
    { key: "master", label: "Master's Degree" },
    { key: "doctorate", label: "Doctorate Degree" },
    { key: "professional", label: "Professional Degree" },
    { key: "certificate", label: "Certificate" },
    { key: "diploma", label: "Diploma" },
    { key: "postgraduate_diploma", label: "Postgraduate Diploma" },
    { key: "phd", label: "PhD" },
    { key: "mba", label: "MBA (Master of Business Administration)" },
    { key: "md", label: "MD (Doctor of Medicine)" },
    { key: "jd", label: "JD (Juris Doctor)" },
    { key: "edd", label: "EdD (Doctor of Education)" },
    { key: "ms", label: "MS (Master of Science)" },
    { key: "ma", label: "MA (Master of Arts)" },
    { key: "mfa", label: "MFA (Master of Fine Arts)" },
    { key: "bfa", label: "BFA (Bachelor of Fine Arts)" },
    { key: "bs", label: "BS (Bachelor of Science)" },
    { key: "ba", label: "BA (Bachelor of Arts)" },
    { key: "llb", label: "LLB (Bachelor of Laws)" },
    { key: "llm", label: "LLM (Master of Laws)" },
    { key: "mph", label: "MPH (Master of Public Health)" },
    { key: "mres", label: "MRes (Master of Research)" },
    { key: "msc", label: "MSc (Master of Science in Computing)" },
    { key: "pgce", label: "PGCE (Postgraduate Certificate in Education)" },
  ];
  
  export default universityDegrees;  