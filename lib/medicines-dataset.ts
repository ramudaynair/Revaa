// Mock dataset for medicines
export interface Medicine {
  id: string
  name: string
  genericName: string
  category: string
  description: string
  uses: string[]
  dosage: {
    adult: string
    child: string
    elderly: string
  }
  sideEffects: string[]
  contraindications: string[]
  interactions: string[]
  precautions: string[]
  form: string
  strength: string
  manufacturer: string
  price: {
    min: number
    max: number
    currency: string
  }
  prescription: boolean
  schedule: string
}

export const medicinesDataset: Medicine[] = [
  {
    id: "med001",
    name: "Paracetamol",
    genericName: "Acetaminophen",
    category: "Analgesic/Antipyretic",
    description: "A common pain reliever and fever reducer",
    uses: ["Headache", "Fever", "Body aches", "Cold and flu symptoms", "Dental pain"],
    dosage: {
      adult: "500-1000mg every 4-6 hours, max 4000mg/day",
      child: "10-15mg/kg every 4-6 hours",
      elderly: "500mg every 6 hours, max 3000mg/day"
    },
    sideEffects: ["Nausea", "Skin rash", "Liver damage (overdose)", "Allergic reactions"],
    contraindications: ["Severe liver disease", "Alcohol dependence", "Known hypersensitivity"],
    interactions: ["Warfarin", "Alcohol", "Phenytoin", "Carbamazepine"],
    precautions: ["Don't exceed recommended dose", "Avoid alcohol", "Check other medications for paracetamol"],
    form: "Tablet",
    strength: "500mg",
    manufacturer: "Various",
    price: { min: 10, max: 50, currency: "INR" },
    prescription: false,
    schedule: "OTC"
  },
  {
    id: "med002",
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    category: "Antibiotic",
    description: "A penicillin-type antibiotic used to treat bacterial infections",
    uses: ["Respiratory tract infections", "Urinary tract infections", "Skin infections", "Ear infections"],
    dosage: {
      adult: "250-500mg every 8 hours or 500-875mg every 12 hours",
      child: "20-40mg/kg/day divided into 3 doses",
      elderly: "Same as adult, monitor kidney function"
    },
    sideEffects: ["Diarrhea", "Nausea", "Vomiting", "Skin rash", "Allergic reactions"],
    contraindications: ["Penicillin allergy", "Severe kidney disease", "Mononucleosis"],
    interactions: ["Warfarin", "Methotrexate", "Oral contraceptives", "Probenecid"],
    precautions: ["Complete full course", "Take with food", "Monitor for allergic reactions"],
    form: "Capsule",
    strength: "500mg",
    manufacturer: "Various",
    price: { min: 80, max: 200, currency: "INR" },
    prescription: true,
    schedule: "H"
  },
  {
    id: "med003",
    name: "Metformin",
    genericName: "Metformin Hydrochloride",
    category: "Antidiabetic",
    description: "First-line medication for type 2 diabetes",
    uses: ["Type 2 diabetes", "PCOS", "Prediabetes prevention"],
    dosage: {
      adult: "500mg twice daily with meals, increase gradually",
      child: "Not recommended under 10 years",
      elderly: "Start with lower dose, monitor kidney function"
    },
    sideEffects: ["Nausea", "Diarrhea", "Metallic taste", "Lactic acidosis (rare)", "Vitamin B12 deficiency"],
    contraindications: ["Kidney disease", "Liver disease", "Heart failure", "Alcohol abuse"],
    interactions: ["Alcohol", "Contrast dyes", "Cimetidine", "Furosemide"],
    precautions: ["Take with meals", "Regular kidney function tests", "Avoid alcohol"],
    form: "Tablet",
    strength: "500mg",
    manufacturer: "Various",
    price: { min: 50, max: 150, currency: "INR" },
    prescription: true,
    schedule: "H"
  },
  {
    id: "med004",
    name: "Lisinopril",
    genericName: "Lisinopril",
    category: "ACE Inhibitor",
    description: "Used to treat high blood pressure and heart failure",
    uses: ["Hypertension", "Heart failure", "Post-heart attack care", "Diabetic nephropathy"],
    dosage: {
      adult: "5-10mg once daily, max 40mg/day",
      child: "Not recommended",
      elderly: "Start with 2.5mg daily"
    },
    sideEffects: ["Dry cough", "Dizziness", "Hyperkalemia", "Angioedema", "Fatigue"],
    contraindications: ["Pregnancy", "Angioedema history", "Bilateral renal artery stenosis"],
    interactions: ["Potassium supplements", "NSAIDs", "Lithium", "Diuretics"],
    precautions: ["Monitor blood pressure", "Check kidney function", "Rise slowly from sitting"],
    form: "Tablet",
    strength: "10mg",
    manufacturer: "Various",
    price: { min: 100, max: 300, currency: "INR" },
    prescription: true,
    schedule: "H"
  },
  {
    id: "med005",
    name: "Omeprazole",
    genericName: "Omeprazole",
    category: "Proton Pump Inhibitor",
    description: "Reduces stomach acid production",
    uses: ["GERD", "Peptic ulcers", "H. pylori infection", "Zollinger-Ellison syndrome"],
    dosage: {
      adult: "20-40mg once daily before breakfast",
      child: "0.7-3.3mg/kg once daily",
      elderly: "Same as adult dose"
    },
    sideEffects: ["Headache", "Nausea", "Diarrhea", "Bone fractures (long-term)", "Vitamin B12 deficiency"],
    contraindications: ["Hypersensitivity to PPIs", "Severe liver disease"],
    interactions: ["Warfarin", "Clopidogrel", "Phenytoin", "Atazanavir"],
    precautions: ["Take before meals", "Monitor for bone health", "Gradual withdrawal after long-term use"],
    form: "Capsule",
    strength: "20mg",
    manufacturer: "Various",
    price: { min: 60, max: 180, currency: "INR" },
    prescription: false,
    schedule: "OTC"
  },
  {
    id: "med006",
    name: "Aspirin",
    genericName: "Acetylsalicylic Acid",
    category: "NSAID/Antiplatelet",
    description: "Pain reliever and blood thinner",
    uses: ["Pain relief", "Fever", "Heart attack prevention", "Stroke prevention", "Inflammation"],
    dosage: {
      adult: "75-325mg daily for cardioprotection, 500-1000mg for pain",
      child: "Not recommended under 16 years",
      elderly: "Lower doses, monitor for bleeding"
    },
    sideEffects: ["Stomach upset", "Bleeding", "Ringing in ears", "Allergic reactions"],
    contraindications: ["Active bleeding", "Severe asthma", "Children under 16", "Third trimester pregnancy"],
    interactions: ["Warfarin", "Methotrexate", "ACE inhibitors", "Alcohol"],
    precautions: ["Take with food", "Monitor for bleeding", "Avoid in viral infections (children)"],
    form: "Tablet",
    strength: "75mg",
    manufacturer: "Various",
    price: { min: 20, max: 80, currency: "INR" },
    prescription: false,
    schedule: "OTC"
  },
  {
    id: "med007",
    name: "Cetirizine",
    genericName: "Cetirizine Hydrochloride",
    category: "Antihistamine",
    description: "Non-drowsy antihistamine for allergies",
    uses: ["Allergic rhinitis", "Urticaria", "Hay fever", "Skin allergies"],
    dosage: {
      adult: "10mg once daily",
      child: "2.5-5mg once daily (age dependent)",
      elderly: "5mg once daily or 10mg every other day"
    },
    sideEffects: ["Drowsiness", "Dry mouth", "Fatigue", "Nausea", "Dizziness"],
    contraindications: ["End-stage renal disease", "Hypersensitivity"],
    interactions: ["Alcohol", "CNS depressants", "Theophylline"],
    precautions: ["May cause drowsiness", "Avoid alcohol", "Adjust dose in kidney disease"],
    form: "Tablet",
    strength: "10mg",
    manufacturer: "Various",
    price: { min: 40, max: 120, currency: "INR" },
    prescription: false,
    schedule: "OTC"
  },
  {
    id: "med008",
    name: "Atorvastatin",
    genericName: "Atorvastatin Calcium",
    category: "Statin",
    description: "Cholesterol-lowering medication",
    uses: ["High cholesterol", "Heart disease prevention", "Stroke prevention"],
    dosage: {
      adult: "10-80mg once daily in evening",
      child: "Not typically used",
      elderly: "Start with lower dose"
    },
    sideEffects: ["Muscle pain", "Liver enzyme elevation", "Headache", "Nausea", "Diabetes risk"],
    contraindications: ["Active liver disease", "Pregnancy", "Breastfeeding", "Muscle disease"],
    interactions: ["Cyclosporine", "Gemfibrozil", "Warfarin", "Digoxin"],
    precautions: ["Monitor liver function", "Report muscle pain", "Take in evening"],
    form: "Tablet",
    strength: "20mg",
    manufacturer: "Various",
    price: { min: 150, max: 400, currency: "INR" },
    prescription: true,
    schedule: "H"
  },
  {
    id: "med009",
    name: "Salbutamol",
    genericName: "Salbutamol Sulfate",
    category: "Bronchodilator",
    description: "Fast-acting bronchodilator for asthma and COPD",
    uses: ["Asthma", "COPD", "Bronchospasm", "Exercise-induced asthma"],
    dosage: {
      adult: "100-200mcg inhaled as needed, max 8 puffs/day",
      child: "100mcg inhaled as needed",
      elderly: "Same as adult, monitor heart rate"
    },
    sideEffects: ["Tremor", "Palpitations", "Headache", "Muscle cramps", "Throat irritation"],
    contraindications: ["Hypersensitivity", "Severe heart disease"],
    interactions: ["Beta-blockers", "MAO inhibitors", "Tricyclic antidepressants"],
    precautions: ["Use spacer device", "Don't exceed recommended dose", "Monitor peak flow"],
    form: "Inhaler",
    strength: "100mcg/dose",
    manufacturer: "Various",
    price: { min: 200, max: 500, currency: "INR" },
    prescription: true,
    schedule: "H"
  },
  {
    id: "med010",
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    category: "NSAID",
    description: "Non-steroidal anti-inflammatory drug",
    uses: ["Pain relief", "Inflammation", "Fever", "Arthritis", "Menstrual pain"],
    dosage: {
      adult: "200-400mg every 4-6 hours, max 1200mg/day",
      child: "5-10mg/kg every 6-8 hours",
      elderly: "Lower doses, monitor kidney function"
    },
    sideEffects: ["Stomach upset", "Kidney problems", "High blood pressure", "Heart problems", "Bleeding"],
    contraindications: ["Active peptic ulcer", "Severe heart failure", "Severe kidney disease", "Aspirin allergy"],
    interactions: ["Warfarin", "ACE inhibitors", "Lithium", "Methotrexate"],
    precautions: ["Take with food", "Monitor blood pressure", "Avoid in heart disease"],
    form: "Tablet",
    strength: "400mg",
    manufacturer: "Various",
    price: { min: 30, max: 100, currency: "INR" },
    prescription: false,
    schedule: "OTC"
  }
]

// Search function for medicines
export function searchMedicines(query: string): Medicine[] {
  const searchTerm = query.toLowerCase()
  return medicinesDataset.filter(medicine => 
    medicine.name.toLowerCase().includes(searchTerm) ||
    medicine.genericName.toLowerCase().includes(searchTerm) ||
    medicine.category.toLowerCase().includes(searchTerm) ||
    medicine.uses.some(use => use.toLowerCase().includes(searchTerm))
  )
}

// Get medicine by ID
export function getMedicineById(id: string): Medicine | undefined {
  return medicinesDataset.find(medicine => medicine.id === id)
}

// Get medicines by category  
export function getMedicinesByCategory(category: string): Medicine[] {
  return medicinesDataset.filter(medicine => 
    medicine.category.toLowerCase() === category.toLowerCase()
  )
}
