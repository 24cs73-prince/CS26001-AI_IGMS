import { Exam } from "../models/Exam.js";

const DEFAULT_EXAMS = [
  {
    title: "Class 1 Environmental Studies (EVS) - Unit Test",
    classVal: "1",
    subject: "Environmental Studies (EVS)",
    syllabus: "Plant Life, Animals, Family & Home",
    duration: "30 minutes",
    durationMinutes: 30,
    totalQuestions: 10,
    totalMarks: 10,
    status: "Published",
    questions: [
      { id: 1, question: "Which part of the plant absorbs water from soil?", options: ["Leaves", "Roots", "Flower", "Stem"], correctAnswer: 1, marks: 1 },
      { id: 2, question: "Which animal gives us milk?", options: ["Dog", "Cat", "Cow", "Lion"], correctAnswer: 2, marks: 1 },
      { id: 3, question: "What is the primary source of light on Earth?", options: ["Moon", "Sun", "Stars", "Bulb"], correctAnswer: 1, marks: 1 },
      { id: 4, question: "How many eyes do humans have?", options: ["One", "Two", "Three", "Four"], correctAnswer: 1, marks: 1 },
      { id: 5, question: "Which bird cannot fly high in the sky?", options: ["Eagle", "Hen", "Pigeon", "Parrot"], correctAnswer: 1, marks: 1 },
      { id: 6, question: "What color is fresh grass?", options: ["Blue", "Red", "Green", "Yellow"], correctAnswer: 2, marks: 1 },
      { id: 7, question: "Who is your father's mother?", options: ["Aunt", "Grandmother", "Sister", "Mother"], correctAnswer: 1, marks: 1 },
      { id: 8, question: "Which sense organ helps us to hear sounds?", options: ["Eyes", "Ears", "Nose", "Tongue"], correctAnswer: 1, marks: 1 },
      { id: 9, question: "What should we do before eating food?", options: ["Sleep", "Wash hands", "Run", "Play"], correctAnswer: 1, marks: 1 },
      { id: 10, question: "Where do fish live?", options: ["Air", "Tree", "Water", "Land"], correctAnswer: 2, marks: 1 }
    ]
  },
  {
    title: "Class 5 Science - Term Exam 1",
    classVal: "5",
    subject: "Science",
    syllabus: "Chapters 1 to 3: Living Organisms, Plant Life & Human Body Basics",
    duration: "30 minutes",
    durationMinutes: 30,
    totalQuestions: 10,
    totalMarks: 10,
    status: "Published",
    questions: [
      { id: 1, question: "Which organ controls all functions of the human body?", options: ["Heart", "Brain", "Lungs", "Stomach"], correctAnswer: 1, marks: 1 },
      { id: 2, question: "What process do green plants use to prepare their food?", options: ["Respiration", "Photosynthesis", "Transpiration", "Evaporation"], correctAnswer: 1, marks: 1 },
      { id: 3, question: "Which gas do humans inhale during breathing?", options: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"], correctAnswer: 1, marks: 1 },
      { id: 4, question: "Which of the following is an omnivorous animal?", options: ["Cow", "Tiger", "Human", "Deer"], correctAnswer: 2, marks: 1 },
      { id: 5, question: "Water boils at what temperature at standard pressure?", options: ["50°C", "80°C", "100°C", "120°C"], correctAnswer: 2, marks: 1 },
      { id: 6, question: "Which organ pumps blood throughout the human body?", options: ["Brain", "Heart", "Lungs", "Kidney"], correctAnswer: 1, marks: 1 },
      { id: 7, question: "What is the green pigment in plant leaves called?", options: ["Hemoglobin", "Chlorophyll", "Melanin", "Carotene"], correctAnswer: 1, marks: 1 },
      { id: 8, question: "Which instrument is used to measure body temperature?", options: ["Barometer", "Thermometer", "Speedometer", "Seismograph"], correctAnswer: 1, marks: 1 },
      { id: 9, question: "How many bones are in the adult human skeleton?", options: ["106", "206", "306", "406"], correctAnswer: 1, marks: 1 },
      { id: 10, question: "Which layer of gas protects Earth from harmful ultraviolet rays?", options: ["Oxygen", "Ozone Layer", "Carbon Dioxide", "Nitrogen"], correctAnswer: 1, marks: 1 }
    ]
  },
  {
    title: "Class 8 Science - Unit Test 1",
    classVal: "8",
    subject: "Science",
    syllabus: "Cell Structure, Microorganisms, Force & Pressure",
    duration: "30 minutes",
    durationMinutes: 30,
    totalQuestions: 10,
    totalMarks: 10,
    status: "Published",
    questions: [
      { id: 1, question: "What is the basic structural and functional unit of life?", options: ["Tissue", "Organ", "Cell", "Organism"], correctAnswer: 2, marks: 1 },
      { id: 2, question: "Which organelle is known as the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Apparatus"], correctAnswer: 1, marks: 1 },
      { id: 3, question: "Which microorganism is used in the preparation of bread and cake?", options: ["Amoeba", "Yeast", "Lactobacillus", "Penicillium"], correctAnswer: 1, marks: 1 },
      { id: 4, question: "What is the SI unit of force?", options: ["Joule", "Pascal", "Newton", "Watt"], correctAnswer: 2, marks: 1 },
      { id: 5, question: "Pressure is defined as:", options: ["Force × Area", "Force / Area", "Area / Force", "Mass × Acceleration"], correctAnswer: 1, marks: 1 },
      { id: 6, question: "Which metal is stored in kerosene due to high reactivity?", options: ["Iron", "Copper", "Sodium", "Gold"], correctAnswer: 2, marks: 1 },
      { id: 7, question: "The disease Malaria is caused by which protozoan?", options: ["Amoeba", "Plasmodium", "Paramecium", "Trypanosoma"], correctAnswer: 1, marks: 1 },
      { id: 8, question: "Friction always opposes:", options: ["Motion", "Rest", "Gravity", "Mass"], correctAnswer: 0, marks: 1 },
      { id: 9, question: "Sound cannot travel through:", options: ["Air", "Water", "Steel", "Vacuum"], correctAnswer: 3, marks: 1 },
      { id: 10, question: "Which planet is nearest to the Sun?", options: ["Venus", "Earth", "Mercury", "Mars"], correctAnswer: 2, marks: 1 }
    ]
  },
  {
    title: "Class 3 Mathematics - Mid Term",
    classVal: "3",
    subject: "Mathematics",
    syllabus: "Numbers, Addition, Subtraction, Shapes",
    duration: "30 minutes",
    durationMinutes: 30,
    totalQuestions: 10,
    totalMarks: 10,
    status: "Published",
    questions: [
      { id: 1, question: "What is 45 + 35?", options: ["70", "80", "85", "90"], correctAnswer: 1, marks: 1 },
      { id: 2, question: "What is the place value of 7 in 742?", options: ["7", "70", "700", "7000"], correctAnswer: 2, marks: 1 },
      { id: 3, question: "How many sides does a triangle have?", options: ["2", "3", "4", "5"], correctAnswer: 1, marks: 1 },
      { id: 4, question: "What is 100 - 45?", options: ["45", "50", "55", "65"], correctAnswer: 2, marks: 1 },
      { id: 5, question: "What is 6 × 8?", options: ["42", "48", "54", "56"], correctAnswer: 1, marks: 1 },
      { id: 6, question: "Which shape has 4 equal sides?", options: ["Rectangle", "Triangle", "Square", "Circle"], correctAnswer: 2, marks: 1 },
      { id: 7, question: "What is half of 50?", options: ["20", "25", "30", "35"], correctAnswer: 1, marks: 1 },
      { id: 8, question: "Which is the smallest 3-digit number?", options: ["99", "100", "101", "111"], correctAnswer: 1, marks: 1 },
      { id: 9, question: "What is 9 × 0?", options: ["9", "0", "1", "90"], correctAnswer: 1, marks: 1 },
      { id: 10, question: "How many minutes are there in 1 hour?", options: ["30", "45", "60", "90"], correctAnswer: 2, marks: 1 }
    ]
  },
  {
    title: "Sanskrit AI Term Exam (Class 8)",
    classVal: "8",
    subject: "Sanskrit",
    syllabus: "Basic Grammar & Vocabulary",
    duration: "20 minutes",
    durationMinutes: 20,
    totalQuestions: 10,
    totalMarks: 10,
    status: "Published",
    questions: [
      { id: 1, question: "संस्कृत भाषायाः वर्णमालायां कति स्वराः सन्ति?", options: ["10", "13", "15", "20"], correctAnswer: 1, marks: 1 },
      { id: 2, question: "'पठति' शब्दस्य पदभेदः कः?", options: ["संज्ञा", "सर्वनाम", "क्रिया", "विशेषणम"], correctAnswer: 2, marks: 1 },
      { id: 3, question: "गच्छति इति रूपं कस्य लकारस्य अस्ति?", options: ["लट् लकारः", "लोट् लकारः", "लङ् लकारः", "लृट् लकारः"], correctAnswer: 0, marks: 1 },
      { id: 4, question: "'विद्यालयः' पदस्य सन्धि-विच्छेदः कः?", options: ["विद्या + आलयः", "विद्या + लयः", "विद् + आलयः", "विद्य + आलयः"], correctAnswer: 0, marks: 1 },
      { id: 5, question: "सूर्यः कस्यां दिशि उदेति?", options: ["पश्चिमदिशि", "पूर्वदिशि", "उत्तरदिशि", "दक्षिणदिशि"], correctAnswer: 1, marks: 1 },
      { id: 6, question: "'रामः' इति शब्दस्य प्रथमा विभक्तेः एकवचनं किम्?", options: ["रामम्", "रामेण", "रामः", "रामाय"], correctAnswer: 2, marks: 1 },
      { id: 7, question: "सत्यमेव ___ जयते।", options: ["न", "जयते", "जयति", "मा"], correctAnswer: 1, marks: 1 },
      { id: 8, question: "'बालकः जलं पिबति' अस्मिन् वाक्ये कर्मपदं किम्?", options: ["बालकः", "जलं", "पिबति", "कोऽपि न"], correctAnswer: 1, marks: 1 },
      { id: 9, question: "संस्कृत साहित्यस्य आदिकविः कः मन्यते?", options: ["कालिदासः", "वाल्मीकिः", "वेदव्यासः", "माघः"], correctAnswer: 1, marks: 1 },
      { id: 10, question: "'कमलम्' शब्दस्य पर्यायपदं किम्?", options: ["पङ्कजम्", "पुष्पम्", "वृक्षः", "जलम्"], correctAnswer: 0, marks: 1 }
    ]
  }
];

export async function seedExamsIfEmpty() {
  try {
    for (const item of DEFAULT_EXAMS) {
      const exists = await Exam.findOne({ title: item.title });
      if (!exists) {
        await Exam.create(item);
        console.log(`🌱 Seeded exam into MongoDB: ${item.title}`);
      }
    }
  } catch (err) {
    console.error("Error seeding default exams to MongoDB:", err.message);
  }
}
