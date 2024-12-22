export interface Country {
    name: string;
    flag: string;
  }
  
  export interface Language {
    code: string;
    name: string;
  }
  
  export interface PhoneCode {
    country: string;
    code: string;
  }
  
  export interface CountryAPIResponse {
    name: {
      common: string;
    };
    flags: {
      svg: string;
    };
    languages?: {
      [key: string]: string;
    };
    idd?: {
      root?: string;
      suffixes?: string[];
    };
  }