interface CantonData {
    id: string;
    name: string;
    users: number;
    abbreviation: string;
    fill: string;
  }
  
  export const swissCantonColors = {
    zurich: "hsl(215, 90%, 52%)",
    bern: "hsl(338, 85%, 45%)",
    vaud: "hsl(150, 65%, 40%)",
    geneva: "hsl(26, 85%, 55%)",
    stgallen: "hsl(280, 60%, 50%)",
    basel: "hsl(186, 75%, 45%)",
    ticino: "hsl(45, 90%, 45%)",
    valais: "hsl(355, 80%, 50%)",
    lucerne: "hsl(195, 85%, 45%)",
    aargau: "hsl(135, 70%, 45%)",
    thurgau: "hsl(250, 65%, 55%)",
    fribourg: "hsl(15, 80%, 50%)",
    solothurn: "hsl(165, 75%, 40%)",
    graubunden: "hsl(305, 70%, 45%)",
    basel_landschaft: "hsl(85, 65%, 45%)",
    neuchatel: "hsl(225, 80%, 50%)",
    schwyz: "hsl(0, 85%, 50%)",
    zug: "hsl(175, 75%, 45%)",
    schaffhausen: "hsl(265, 70%, 50%)",
    jura: "hsl(35, 85%, 50%)",
    appenzell: "hsl(145, 65%, 45%)",
    nidwalden: "hsl(290, 75%, 45%)",
    glarus: "hsl(55, 80%, 45%)",
    obwalden: "hsl(205, 70%, 50%)",
    uri: "hsl(115, 75%, 40%)",
    appenzell_innerrhoden: "hsl(235, 80%, 45%)",
  } as const;
  
  export const swissCantonData: CantonData[] = [
    { id: "zh", name: "Zürich", users: 2850, abbreviation: "ZH", fill: swissCantonColors.zurich },
    { id: "be", name: "Bern", users: 2100, abbreviation: "BE", fill: swissCantonColors.bern },
    { id: "vd", name: "Vaud", users: 1950, abbreviation: "VD", fill: swissCantonColors.vaud },
    { id: "ge", name: "Geneva", users: 1800, abbreviation: "GE", fill: swissCantonColors.geneva },
    { id: "sg", name: "St. Gallen", users: 1250, abbreviation: "SG", fill: swissCantonColors.stgallen },
    { id: "bs", name: "Basel-Stadt", users: 1100, abbreviation: "BS", fill: swissCantonColors.basel },
    { id: "ti", name: "Ticino", users: 980, abbreviation: "TI", fill: swissCantonColors.ticino },
    { id: "vs", name: "Valais", users: 850, abbreviation: "VS", fill: swissCantonColors.valais },
    { id: "lu", name: "Lucerne", users: 820, abbreviation: "LU", fill: swissCantonColors.lucerne },
    { id: "ag", name: "Aargau", users: 780, abbreviation: "AG", fill: swissCantonColors.aargau },
    { id: "tg", name: "Thurgau", users: 650, abbreviation: "TG", fill: swissCantonColors.thurgau },
    { id: "fr", name: "Fribourg", users: 620, abbreviation: "FR", fill: swissCantonColors.fribourg },
    { id: "so", name: "Solothurn", users: 580, abbreviation: "SO", fill: swissCantonColors.solothurn },
    { id: "gr", name: "Graubünden", users: 520, abbreviation: "GR", fill: swissCantonColors.graubunden },
    { id: "bl", name: "Basel-Landschaft", users: 490, abbreviation: "BL", fill: swissCantonColors.basel_landschaft },
    { id: "ne", name: "Neuchâtel", users: 450, abbreviation: "NE", fill: swissCantonColors.neuchatel },
    { id: "sz", name: "Schwyz", users: 380, abbreviation: "SZ", fill: swissCantonColors.schwyz },
    { id: "zg", name: "Zug", users: 350, abbreviation: "ZG", fill: swissCantonColors.zug },
    { id: "sh", name: "Schaffhausen", users: 280, abbreviation: "SH", fill: swissCantonColors.schaffhausen },
    { id: "ju", name: "Jura", users: 250, abbreviation: "JU", fill: swissCantonColors.jura },
    { id: "ar", name: "Appenzell Ausserrhoden", users: 180, abbreviation: "AR", fill: swissCantonColors.appenzell },
    { id: "nw", name: "Nidwalden", users: 150, abbreviation: "NW", fill: swissCantonColors.nidwalden },
    { id: "gl", name: "Glarus", users: 120, abbreviation: "GL", fill: swissCantonColors.glarus },
    { id: "ow", name: "Obwalden", users: 110, abbreviation: "OW", fill: swissCantonColors.obwalden },
    { id: "ur", name: "Uri", users: 90, abbreviation: "UR", fill: swissCantonColors.uri },
    { id: "ai", name: "Appenzell Innerrhoden", users: 80, abbreviation: "AI", fill: swissCantonColors.appenzell_innerrhoden },
  ];
  
  // Calculate total users across all cantons
  export const totalSwissUsers = swissCantonData.reduce((acc, canton) => acc + canton.users, 0);
  
  // Helper function to get percentage for each canton
  export const getCantonPercentage = (users: number): number => {
    return Number(((users / totalSwissUsers) * 100).toFixed(1));
  };
  
  // Configuration for the chart
  export const swissChartConfig = {
    users: {
      label: "Users",
    },
    ...swissCantonData.reduce((acc, canton) => ({
      ...acc,
      [canton.id]: {
        label: canton.name,
        color: canton.fill,
      },
    }), {}),
  } as const;
  
  // Add to monthlyTrends in your existing data structure
  export const swissMonthlyGrowth = [
    { month: "Jan", users: 12500 },
    { month: "Feb", users: 13800 },
    { month: "Mar", users: 15100 },
    { month: "Apr", users: 16400 },
    { month: "May", users: 17200 },
    { month: "Jun", users: 17930 }
  ];