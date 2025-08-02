// Mock dataset for symptoms and diseases
export interface Symptom {
  id: string
  name: string
  description: string
  severity: 'mild' | 'moderate' | 'severe' | 'critical'
  category: string
  commonCauses: string[]
  associatedSymptoms: string[]
  whenToSeekHelp: string[]
  homeRemedies: string[]
  duration: string
}

export interface Disease {
  id: string
  name: string
  description: string
  category: string
  commonSymptoms: string[]
  causes: string[]
  riskFactors: string[]
  treatment: string[]
  prevention: string[]
  complications: string[]
  severity: 'mild' | 'moderate' | 'severe' | 'critical'
  contagious: boolean
  duration: string
}

export interface DiagnosisResult {
  possibleConditions: {
    disease: Disease
    probability: number
    matchingSymptoms: string[]
  }[]
  urgency: 'low' | 'medium' | 'high' | 'emergency'
  recommendations: string[]
  disclaimer: string
}

export const symptomsDataset: Symptom[] = [
  {
    id: "sym001",
    name: "Headache",
    description: "Pain or discomfort in the head or neck area",
    severity: "mild",
    category: "Neurological",
    commonCauses: ["Tension", "Dehydration", "Stress", "Eye strain", "Sinusitis", "Migraine"],
    associatedSymptoms: ["Nausea", "Sensitivity to light", "Neck stiffness", "Fatigue"],
    whenToSeekHelp: ["Sudden severe headache", "Headache with fever and stiff neck", "Headache after head injury", "Progressive worsening"],
    homeRemedies: ["Rest in dark room", "Apply cold/warm compress", "Stay hydrated", "Gentle neck massage"],
    duration: "Few hours to several days"
  },
  {
    id: "sym002", 
    name: "Fever",
    description: "Elevated body temperature above normal (>100.4°F/38°C)",
    severity: "moderate",
    category: "General",
    commonCauses: ["Viral infection", "Bacterial infection", "Inflammatory conditions", "Heat exhaustion"],
    associatedSymptoms: ["Chills", "Sweating", "Headache", "Muscle aches", "Fatigue", "Loss of appetite"],
    whenToSeekHelp: ["Fever >103°F", "Fever lasting >3 days", "Difficulty breathing", "Severe headache", "Rash"],
    homeRemedies: ["Rest", "Drink fluids", "Cool compress", "Light clothing", "Lukewarm bath"],
    duration: "1-3 days typically"
  },
  {
    id: "sym003",
    name: "Cough",
    description: "Reflex action to clear throat and airways",
    severity: "mild",
    category: "Respiratory",
    commonCauses: ["Common cold", "Flu", "Allergies", "Asthma", "GERD", "Smoking"],
    associatedSymptoms: ["Sore throat", "Runny nose", "Chest congestion", "Shortness of breath"],
    whenToSeekHelp: ["Cough with blood", "Persistent cough >3 weeks", "High fever", "Difficulty breathing"],
    homeRemedies: ["Honey", "Warm salt water gargle", "Stay hydrated", "Humidifier", "Avoid irritants"],
    duration: "1-2 weeks for acute cough"
  },
  {
    id: "sym004",
    name: "Chest Pain",
    description: "Discomfort or pain in the chest area",
    severity: "severe",
    category: "Cardiovascular",
    commonCauses: ["Heart attack", "Angina", "Muscle strain", "Acid reflux", "Anxiety", "Pneumonia"],
    associatedSymptoms: ["Shortness of breath", "Sweating", "Nausea", "Arm pain", "Jaw pain"],
    whenToSeekHelp: ["Crushing chest pain", "Pain with shortness of breath", "Pain radiating to arm/jaw", "Sweating with chest pain"],
    homeRemedies: ["Rest", "Avoid triggers", "Antacids for reflux", "Deep breathing for anxiety"],
    duration: "Varies widely"
  },
  {
    id: "sym005",
    name: "Nausea",
    description: "Feeling of sickness with urge to vomit",
    severity: "mild",
    category: "Gastrointestinal", 
    commonCauses: ["Food poisoning", "Viral gastroenteritis", "Motion sickness", "Pregnancy", "Medications"],
    associatedSymptoms: ["Vomiting", "Diarrhea", "Abdominal pain", "Loss of appetite", "Dizziness"],
    whenToSeekHelp: ["Severe dehydration", "Blood in vomit", "High fever", "Severe abdominal pain"],
    homeRemedies: ["Ginger tea", "Small frequent meals", "Clear fluids", "Rest", "Avoid strong odors"],
    duration: "Few days typically"
  },
  {
    id: "sym006",
    name: "Shortness of Breath",
    description: "Difficulty breathing or feeling breathless",
    severity: "severe",
    category: "Respiratory",
    commonCauses: ["Asthma", "Heart problems", "Pneumonia", "Anxiety", "Anemia", "COVID-19"],
    associatedSymptoms: ["Chest pain", "Wheezing", "Cough", "Fatigue", "Dizziness"],
    whenToSeekHelp: ["Sudden severe breathlessness", "Chest pain with breathlessness", "Blue lips/fingers", "Cannot speak in full sentences"],
    homeRemedies: ["Sit upright", "Pursed lip breathing", "Use fan", "Stay calm", "Remove tight clothing"],
    duration: "Varies by cause"
  },
  {
    id: "sym007",
    name: "Abdominal Pain",
    description: "Pain or discomfort in the stomach area",
    severity: "moderate",
    category: "Gastrointestinal",
    commonCauses: ["Indigestion", "Gas", "Food poisoning", "Appendicitis", "Kidney stones", "Gallstones"],
    associatedSymptoms: ["Nausea", "Vomiting", "Diarrhea", "Fever", "Bloating"],
    whenToSeekHelp: ["Severe sudden pain", "Pain with fever", "Vomiting blood", "Unable to pass gas or stool"],
    homeRemedies: ["Rest", "Heat pad", "Clear fluids", "Avoid solid foods initially", "Gentle massage"],
    duration: "Hours to days depending on cause"
  },
  {
    id: "sym008",
    name: "Fatigue",
    description: "Extreme tiredness or lack of energy",
    severity: "mild",
    category: "General",
    commonCauses: ["Lack of sleep", "Stress", "Depression", "Anemia", "Thyroid problems", "Chronic fatigue syndrome"],
    associatedSymptoms: ["Weakness", "Difficulty concentrating", "Mood changes", "Sleep problems"],
    whenToSeekHelp: ["Persistent fatigue >2 weeks", "Fatigue with other concerning symptoms", "Unable to perform daily activities"],
    homeRemedies: ["Adequate sleep", "Regular exercise", "Balanced diet", "Stress management", "Stay hydrated"],
    duration: "Varies widely"
  },
  {
    id: "sym009",
    name: "Dizziness",
    description: "Feeling lightheaded, unsteady, or spinning sensation",
    severity: "moderate",
    category: "Neurological",
    commonCauses: ["Inner ear problems", "Low blood pressure", "Dehydration", "Medication side effects", "Anxiety"],
    associatedSymptoms: ["Nausea", "Headache", "Hearing changes", "Balance problems"],
    whenToSeekHelp: ["Sudden severe dizziness", "Dizziness with chest pain", "Frequent episodes", "Loss of consciousness"],
    homeRemedies: ["Sit or lie down", "Stay hydrated", "Move slowly", "Avoid sudden position changes"],
    duration: "Minutes to hours typically"
  },
  {
    id: "sym010",
    name: "Skin Rash",
    description: "Changes in skin color, texture, or appearance",
    severity: "mild",
    category: "Dermatological",
    commonCauses: ["Allergic reaction", "Eczema", "Viral infection", "Contact dermatitis", "Stress"],
    associatedSymptoms: ["Itching", "Redness", "Swelling", "Blisters", "Dry skin"],
    whenToSeekHelp: ["Rash with difficulty breathing", "Widespread rash with fever", "Signs of infection", "Severe itching"],
    homeRemedies: ["Cool compress", "Moisturize", "Avoid triggers", "Oatmeal bath", "Loose clothing"],
    duration: "Days to weeks"
  }
]

export const diseasesDataset: Disease[] = [
  {
    id: "dis001",
    name: "Common Cold",
    description: "Viral infection of the upper respiratory tract",
    category: "Respiratory",
    commonSymptoms: ["Runny nose", "Sneezing", "Cough", "Sore throat", "Mild headache", "Low-grade fever"],
    causes: ["Rhinovirus", "Coronavirus", "Adenovirus", "Other respiratory viruses"],
    riskFactors: ["Close contact with infected person", "Weakened immune system", "Stress", "Poor sleep"],
    treatment: ["Rest", "Fluids", "Pain relievers", "Decongestants", "Throat lozenges"],
    prevention: ["Hand hygiene", "Avoid close contact with sick people", "Don't touch face", "Get adequate sleep"],
    complications: ["Sinusitis", "Ear infection", "Bronchitis", "Pneumonia (rare)"],
    severity: "mild",
    contagious: true,
    duration: "7-10 days"
  },
  {
    id: "dis002",
    name: "Influenza",
    description: "Viral infection affecting the respiratory system",
    category: "Respiratory", 
    commonSymptoms: ["High fever", "Chills", "Body aches", "Headache", "Cough", "Sore throat", "Fatigue"],
    causes: ["Influenza A virus", "Influenza B virus", "Influenza C virus"],
    riskFactors: ["Age >65 or <5", "Pregnancy", "Chronic conditions", "Weakened immune system"],
    treatment: ["Antiviral medications", "Rest", "Fluids", "Pain relievers", "Cough suppressants"],
    prevention: ["Annual flu vaccine", "Hand hygiene", "Avoid crowds during flu season", "Cover coughs and sneezes"],
    complications: ["Pneumonia", "Bronchitis", "Sinus infections", "Ear infections", "Myocarditis"],
    severity: "moderate",
    contagious: true,
    duration: "1-2 weeks"
  },
  {
    id: "dis003",
    name: "Hypertension",
    description: "High blood pressure condition",
    category: "Cardiovascular",
    commonSymptoms: ["Often no symptoms", "Headache", "Dizziness", "Blurred vision", "Chest pain"],
    causes: ["Unknown (primary)", "Kidney disease", "Hormonal disorders", "Medications", "Sleep apnea"],
    riskFactors: ["Age", "Family history", "Obesity", "High sodium diet", "Lack of exercise", "Smoking"],
    treatment: ["Lifestyle changes", "ACE inhibitors", "Diuretics", "Beta-blockers", "Calcium channel blockers"],
    prevention: ["Healthy diet", "Regular exercise", "Weight management", "Limit alcohol", "Quit smoking"],
    complications: ["Heart attack", "Stroke", "Kidney disease", "Heart failure", "Vision problems"],
    severity: "moderate",
    contagious: false,
    duration: "Chronic condition"
  },
  {
    id: "dis004",
    name: "Type 2 Diabetes",
    description: "Metabolic disorder characterized by high blood sugar",
    category: "Endocrine",
    commonSymptoms: ["Increased thirst", "Frequent urination", "Fatigue", "Blurred vision", "Slow healing wounds"],
    causes: ["Insulin resistance", "Inadequate insulin production", "Genetic factors", "Lifestyle factors"],
    riskFactors: ["Obesity", "Family history", "Age >45", "Sedentary lifestyle", "High blood pressure"],
    treatment: ["Lifestyle changes", "Metformin", "Insulin", "Other diabetes medications", "Blood sugar monitoring"],
    prevention: ["Healthy diet", "Regular exercise", "Weight management", "Regular health screenings"],
    complications: ["Heart disease", "Stroke", "Kidney disease", "Eye problems", "Nerve damage"],
    severity: "moderate",
    contagious: false,
    duration: "Chronic condition"
  },
  {
    id: "dis005",
    name: "Asthma",
    description: "Chronic respiratory condition causing airway inflammation",
    category: "Respiratory",
    commonSymptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Cough", "Difficulty sleeping"],
    causes: ["Genetic factors", "Environmental triggers", "Allergens", "Respiratory infections"],
    riskFactors: ["Family history", "Allergies", "Respiratory infections in childhood", "Environmental factors"],
    treatment: ["Inhaled corticosteroids", "Bronchodilators", "Leukotriene modifiers", "Avoiding triggers"],
    prevention: ["Identify and avoid triggers", "Take medications as prescribed", "Regular check-ups"],
    complications: ["Severe asthma attacks", "Permanent airway changes", "Side effects from medications"],
    severity: "moderate",
    contagious: false,
    duration: "Chronic condition"
  },
  {
    id: "dis006",
    name: "Gastroenteritis",
    description: "Inflammation of stomach and intestines",
    category: "Gastrointestinal",
    commonSymptoms: ["Diarrhea", "Vomiting", "Nausea", "Abdominal cramps", "Fever", "Dehydration"],
    causes: ["Viral infection", "Bacterial infection", "Food poisoning", "Parasites"],
    riskFactors: ["Poor hygiene", "Contaminated food/water", "Close contact with infected person", "Weakened immune system"],
    treatment: ["Fluid replacement", "Rest", "BRAT diet", "Electrolyte solutions", "Antibiotics (if bacterial)"],
    prevention: ["Hand hygiene", "Safe food handling", "Clean water", "Avoid contaminated food"],
    complications: ["Severe dehydration", "Electrolyte imbalance", "Kidney problems"],
    severity: "mild",
    contagious: true,
    duration: "3-7 days"
  },
  {
    id: "dis007",
    name: "Migraine",
    description: "Severe recurring headache disorder",
    category: "Neurological",
    commonSymptoms: ["Severe headache", "Nausea", "Vomiting", "Sensitivity to light", "Sensitivity to sound", "Aura"],
    causes: ["Genetic factors", "Hormonal changes", "Stress", "Certain foods", "Sleep changes"],
    riskFactors: ["Family history", "Age", "Sex (more common in women)", "Hormonal changes"],
    treatment: ["Pain relievers", "Triptans", "Preventive medications", "Lifestyle changes", "Avoiding triggers"],
    prevention: ["Identify triggers", "Regular sleep", "Stress management", "Regular meals", "Stay hydrated"],
    complications: ["Chronic migraine", "Medication overuse headache", "Status migrainosus"],
    severity: "moderate",
    contagious: false,
    duration: "4-72 hours per episode"
  },
  {
    id: "dis008",
    name: "Anxiety Disorder",
    description: "Mental health condition characterized by excessive worry",
    category: "Mental Health",
    commonSymptoms: ["Excessive worry", "Restlessness", "Fatigue", "Difficulty concentrating", "Muscle tension", "Sleep problems"],
    causes: ["Genetic factors", "Brain chemistry", "Environmental stress", "Medical conditions"],
    riskFactors: ["Family history", "Stressful life events", "Chronic medical conditions", "Substance abuse"],
    treatment: ["Therapy", "Medications", "Lifestyle changes", "Stress management", "Support groups"],
    prevention: ["Stress management", "Regular exercise", "Adequate sleep", "Limit caffeine", "Social support"],
    complications: ["Depression", "Substance abuse", "Social isolation", "Physical health problems"],
    severity: "moderate",
    contagious: false,
    duration: "Chronic condition"
  },
  {
    id: "dis009",
    name: "Urinary Tract Infection",
    description: "Bacterial infection of the urinary system",
    category: "Genitourinary",
    commonSymptoms: ["Burning urination", "Frequent urination", "Cloudy urine", "Pelvic pain", "Strong urine odor"],
    causes: ["E. coli bacteria", "Other bacteria", "Sexual activity", "Poor hygiene"],
    riskFactors: ["Female sex", "Sexual activity", "Certain contraceptives", "Menopause", "Urinary tract abnormalities"],
    treatment: ["Antibiotics", "Pain relievers", "Increased fluid intake", "Cranberry products"],
    prevention: ["Proper hygiene", "Urinate after sex", "Stay hydrated", "Avoid irritating products"],
    complications: ["Kidney infection", "Recurrent infections", "Sepsis", "Pregnancy complications"],
    severity: "mild",
    contagious: false,
    duration: "3-7 days with treatment"
  },
  {
    id: "dis010",
    name: "Eczema",
    description: "Chronic inflammatory skin condition",
    category: "Dermatological",
    commonSymptoms: ["Itchy skin", "Red rash", "Dry skin", "Thick patches", "Small bumps", "Scaling"],
    causes: ["Genetic factors", "Immune system dysfunction", "Environmental triggers", "Stress"],
    riskFactors: ["Family history", "Allergies", "Asthma", "Environmental factors"],
    treatment: ["Moisturizers", "Topical corticosteroids", "Antihistamines", "Avoiding triggers", "Prescription medications"],
    prevention: ["Regular moisturizing", "Avoid triggers", "Gentle skin care", "Stress management"],
    complications: ["Skin infections", "Sleep problems", "Social/emotional issues"],
    severity: "mild",
    contagious: false,
    duration: "Chronic condition with flare-ups"
  }
]

// Symptom checker function
export function checkSymptoms(symptoms: string[], age?: number, gender?: string): DiagnosisResult {
  const inputSymptoms = symptoms.map(s => s.toLowerCase())
  const possibleConditions: DiagnosisResult['possibleConditions'] = []

  // Match symptoms with diseases
  diseasesDataset.forEach(disease => {
    const matchingSymptoms = disease.commonSymptoms.filter(symptom => 
      inputSymptoms.some(inputSymptom => 
        symptom.toLowerCase().includes(inputSymptom) || 
        inputSymptom.includes(symptom.toLowerCase())
      )
    )

    if (matchingSymptoms.length > 0) {
      const probability = (matchingSymptoms.length / disease.commonSymptoms.length) * 100
      possibleConditions.push({
        disease,
        probability: Math.round(probability),
        matchingSymptoms
      })
    }
  })

  // Sort by probability
  possibleConditions.sort((a, b) => b.probability - a.probability)

  // Determine urgency
  let urgency: DiagnosisResult['urgency'] = 'low'
  const hasEmergencySymptoms = inputSymptoms.some(symptom => 
    ['chest pain', 'difficulty breathing', 'severe headache', 'high fever'].includes(symptom)
  )
  const hasSevereConditions = possibleConditions.some(condition => 
    condition.disease.severity === 'severe' || condition.disease.severity === 'critical'
  )

  if (hasEmergencySymptoms) urgency = 'emergency'
  else if (hasSevereConditions) urgency = 'high' 
  else if (possibleConditions.length > 0) urgency = 'medium'

  // Generate recommendations
  const recommendations = [
    "This is for informational purposes only and not a substitute for professional medical advice",
    "Consult a healthcare provider for proper diagnosis and treatment",
  ]

  if (urgency === 'emergency') {
    recommendations.unshift("Seek immediate medical attention or call emergency services")
  } else if (urgency === 'high') {
    recommendations.unshift("Schedule an appointment with your doctor soon")
  } else if (urgency === 'medium') {
    recommendations.push("Monitor symptoms and consult a doctor if they worsen or persist")
  }

  return {
    possibleConditions: possibleConditions.slice(0, 5), // Top 5 matches
    urgency,
    recommendations,
    disclaimer: "This symptom checker is for informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition."
  }
}

// Search symptoms
export function searchSymptoms(query: string): Symptom[] {
  const searchTerm = query.toLowerCase()
  return symptomsDataset.filter(symptom =>
    symptom.name.toLowerCase().includes(searchTerm) ||
    symptom.description.toLowerCase().includes(searchTerm) ||
    symptom.category.toLowerCase().includes(searchTerm) ||
    symptom.commonCauses.some(cause => cause.toLowerCase().includes(searchTerm))
  )
}

// Search diseases
export function searchDiseases(query: string): Disease[] {
  const searchTerm = query.toLowerCase()
  return diseasesDataset.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm) ||
    disease.description.toLowerCase().includes(searchTerm) ||
    disease.category.toLowerCase().includes(searchTerm) ||
    disease.commonSymptoms.some(symptom => symptom.toLowerCase().includes(searchTerm))
  )
}
