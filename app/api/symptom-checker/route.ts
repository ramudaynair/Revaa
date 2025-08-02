import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { checkSymptoms, searchSymptoms, searchDiseases, symptomsDataset, diseasesDataset } from "@/lib/symptoms-diseases-dataset"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { symptoms, age, gender, language = "en" } = body

    // Skip authentication for demo purposes - using mock data
    console.log("Processing symptom checker request without authentication (demo mode)")

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide at least one symptom",
          diagnosis: null,
        },
        { status: 400 }
      )
    }

    console.log("Checking symptoms:", symptoms, "Age:", age, "Gender:", gender)

    // Use the intelligent symptom checker from the dataset
    const diagnosis = checkSymptoms(symptoms, age, gender)
    
    // Add additional context for the response
    const responseData = {
      success: true,
      diagnosis: {
        ...diagnosis,
        inputSymptoms: symptoms,
        patientInfo: {
          age: age || "Not provided",
          gender: gender || "Not provided"
        },
        disclaimers: [
          "This is an AI-powered assessment and should not replace professional medical advice",
          "Please consult a healthcare provider for proper diagnosis and treatment",
          "In case of emergency symptoms, seek immediate medical attention",
          "The assessment is based on general medical knowledge and may not account for individual variations"
        ],
        recommendedActions: diagnosis.urgency === "high" || diagnosis.urgency === "emergency"
          ? [
              "Seek immediate medical attention",
              "Go to emergency room or call emergency services",
              "Do not delay medical care"
            ]
          : diagnosis.urgency === "medium"
          ? [
              "Schedule an appointment with your doctor within 1-2 days",
              "Monitor symptoms closely",
              "Seek immediate care if symptoms worsen"
            ]
          : [
              "Monitor symptoms for a few days",
              "Consider home remedies if appropriate",
              "Consult a doctor if symptoms persist or worsen",
              "Maintain good rest and hydration"
            ]
      },
      language: language,
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error("Symptom checker API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while analyzing symptoms",
        diagnosis: null,
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symptomQuery = searchParams.get("symptom")
    const diseaseQuery = searchParams.get("disease")

    if (symptomQuery) {
      // Search for specific symptom information
      const symptoms = searchSymptoms(symptomQuery)
      
      return NextResponse.json({
        success: true,
        symptoms: symptoms,
        query: symptomQuery,
        totalResults: symptoms.length,
      })
    }

    if (diseaseQuery) {
      // Search for specific disease information
      const diseases = searchDiseases(diseaseQuery)
      
      return NextResponse.json({
        success: true,
        diseases: diseases,
        query: diseaseQuery,
        totalResults: diseases.length,
      })
    }

    // Return available symptoms and diseases for reference
    const availableSymptoms = symptomsDataset.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      category: s.category
    }))

    const availableDiseases = diseasesDataset.map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      category: d.category
    }))
    
    return NextResponse.json({
      success: true,
      availableSymptoms: availableSymptoms,
      availableDiseases: availableDiseases,
      totalSymptoms: symptomsDataset.length,
      totalDiseases: diseasesDataset.length,
      message: "Use POST /api/symptom-checker with {symptoms: ['symptom1', 'symptom2'], age: number, gender: 'male'|'female'} to analyze symptoms",
      exampleRequest: {
        symptoms: ["headache", "fever", "fatigue"],
        age: 30,
        gender: "female"
      }
    })

  } catch (error) {
    console.error("Symptom checker GET API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}
