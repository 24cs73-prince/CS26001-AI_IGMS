/**
 * Mid-Day Meal Menu Data (Bilingual: English ↔ ગુજરાતી)
 * Government of Gujarat School Nutrition & Mid-Day Meal Programme (પી.એમ. પોષણ યોજના)
 */

export const WEEKLY_MEAL_MENU_GU = [
  {
    dayIndex: 1, // Monday
    day: "સોમવાર",
    snack: "સુખડી",
    meal: "વેજીટેબલ ખીચડી અથવા ખારી ભાત શાકભાજી સહિત",
    time: "બપોરે ૧:૩૦ થી ૨:૦૦",
    snackTime: "સવારે ૧૦:૩૦ થી ૧૧:૦૦",
    tag: "પૌષ્ટિક આહાર",
  },
  {
    dayIndex: 2, // Tuesday
    day: "મંગળવાર",
    snack: "કઠોળ ચાટ (કાળા મગ/લીલા મગ, ચણા કે ઉપલબ્ધ કઠોળ)",
    meal: "ફાડા લાપસી અને શાક અથવા મુઠિયા અને શાક",
    time: "બપોરે ૧:૩૦ થી ૨:૦૦",
    snackTime: "સવારે ૧૦:૩૦ થી ૧૧:૦૦",
    tag: "સંતુલિત આહાર",
  },
  {
    dayIndex: 3, // Wednesday
    day: "બુધવાર",
    snack: "મીક્ષ દાળ/ ઉપલબ્ધ કઠોળ/ ઉસળ",
    meal: "વેજીટેબલ પુલાવ",
    time: "બપોરે ૧:૩૦ થી ૨:૦૦",
    snackTime: "સવારે ૧૦:૩૦ થી ૧૧:૦૦",
    tag: "પ્રોટીનયુક્ત આહાર",
  },
  {
    dayIndex: 4, // Thursday
    day: "ગુરુવાર",
    snack: "કઠોળ ચાટ (કાળા મગ/લીલા મગ, ચણા કે ઉપલબ્ધ કઠોળ)",
    meal: "દાળ ઢોકળી",
    time: "બપોરે ૧:૩૦ થી ૨:૦૦",
    snackTime: "સવારે ૧૦:૩૦ થી ૧૧:૦૦",
    tag: "સ્વાદિષ્ટ અને પૌષ્ટિક",
  },
  {
    dayIndex: 5, // Friday
    day: "શુક્રવાર",
    snack: "મુઠિયા",
    meal: "દાળ ભાત",
    time: "બપોરે ૧:૩૦ થી ૨:૦૦",
    snackTime: "સવારે ૧૦:૩૦ થી ૧૧:૦૦",
    tag: "સંપૂર્ણ પૌષ્ટિક આહાર",
  },
  {
    dayIndex: 6, // Saturday
    day: "શનિવાર",
    snack: "કઠોળ ચાટ (કાળા મગ/લીલા મગ, ચણા કે ઉપલબ્ધ કઠોળ)",
    meal: "વેજીટેબલ પુલાવ",
    time: "બપોરે ૧૨:૦૦ થી ૧૨:૩૦",
    snackTime: "સવારે ૯:૩૦ થી ૧૦:૦૦",
    tag: "શનિવારનું વિશેષ ભોજન",
  },
];

export const WEEKLY_MEAL_MENU_EN = [
  {
    dayIndex: 1, // Monday
    day: "Monday",
    snack: "Sukhdi (Traditional Whole Wheat & Jaggery Snack)",
    meal: "Vegetable Khichdi or Khari Bhat with Fresh Vegetables",
    time: "1:30 PM - 2:00 PM",
    snackTime: "10:30 AM - 11:00 AM",
    tag: "Nutritious Diet",
  },
  {
    dayIndex: 2, // Tuesday
    day: "Tuesday",
    snack: "Sprouted Pulses Chaat (Moong / Black Gram / Chickpeas)",
    meal: "Fada Lapsi with Vegetable Curry or Muthia with Curry",
    time: "1:30 PM - 2:00 PM",
    snackTime: "10:30 AM - 11:00 AM",
    tag: "Balanced Diet",
  },
  {
    dayIndex: 3, // Wednesday
    day: "Wednesday",
    snack: "Mixed Dal / Available Sprouted Pulses / Usal",
    meal: "Vegetable Pulao",
    time: "1:30 PM - 2:00 PM",
    snackTime: "10:30 AM - 11:00 AM",
    tag: "Protein Rich",
  },
  {
    dayIndex: 4, // Thursday
    day: "Thursday",
    snack: "Sprouted Pulses Chaat (Moong / Black Gram / Chickpeas)",
    meal: "Dal Dhokli",
    time: "1:30 PM - 2:00 PM",
    snackTime: "10:30 AM - 11:00 AM",
    tag: "Wholesome & Delicious",
  },
  {
    dayIndex: 5, // Friday
    day: "Friday",
    snack: "Steamed Vegetable Muthia",
    meal: "Dal Rice (Dal-Bhat)",
    time: "1:30 PM - 2:00 PM",
    snackTime: "10:30 AM - 11:00 AM",
    tag: "Complete Nutrition",
  },
  {
    dayIndex: 6, // Saturday
    day: "Saturday",
    snack: "Sprouted Pulses Chaat (Moong / Black Gram / Chickpeas)",
    meal: "Vegetable Pulao",
    time: "12:00 PM - 12:30 PM",
    snackTime: "9:30 AM - 10:00 AM",
    tag: "Saturday Special Meal",
  },
];

export function getWeeklyMenu(language = "en") {
  return language === "gu" ? WEEKLY_MEAL_MENU_GU : WEEKLY_MEAL_MENU_EN;
}

export const WEEKLY_MEAL_MENU = WEEKLY_MEAL_MENU_GU;

/**
 * Returns today's meal info based on current day of week and language
 */
export function getTodaysMeal(customDate = new Date(), language = "en") {
  const dayIndex = customDate.getDay();
  const menu = getWeeklyMenu(language);

  if (dayIndex === 0) {
    return {
      isSunday: true,
      isHoliday: true,
      day: language === "gu" ? "રવિવાર" : "Sunday",
      holidayMessage: language === "gu" ? "આજે શાળામાં રજા છે." : "School is closed today.",
      holidaySubMessage:
        language === "gu"
          ? "રવિવાર હોવાથી મધ્યાહન ભોજન બંધ રહેશે."
          : "Mid-Day Meal is unavailable today due to Sunday school holiday.",
      snack: null,
      meal: null,
      time: null,
    };
  }

  const found = menu.find((m) => m.dayIndex === dayIndex);
  if (found) {
    return {
      isSunday: false,
      isHoliday: false,
      day: found.day,
      snack: found.snack,
      meal: found.meal,
      time: found.time,
      snackTime: found.snackTime,
      tag: found.tag,
    };
  }

  return {
    isSunday: false,
    isHoliday: true,
    day: "",
    holidayMessage: language === "gu" ? "આજે શાળામાં રજા છે." : "School is closed today on holiday.",
    holidaySubMessage:
      language === "gu"
        ? "આજે શાળામાં રજા હોવાથી મધ્યાહન ભોજન ઉપલબ્ધ નથી."
        : "Mid-Day Meal is unavailable today due to school holiday.",
    snack: null,
    meal: null,
    time: null,
  };
}
