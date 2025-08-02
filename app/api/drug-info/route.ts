import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { searchMedicines, getMedicineById, getMedicinesByCategory, medicinesDataset } from "@/lib/medicines-dataset"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, language = "en" } = body

    // Skip authentication for demo purposes - using mock data
    console.log("Processing drug info request without authentication (demo mode)")

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a valid search query",
          medicines: [],
        },
        { status: 400 }
      )
    }

    console.log("Searching medicines for query:", query)

    // Search medicines using the mock dataset
    const searchResults = searchMedicines(query.trim())
    
    // Format results for response
    const formattedResults = searchResults.map(medicine => ({
      id: medicine.id,
      name: medicine.name,
      genericName: medicine.genericName,
      category: medicine.category,
      description: medicine.description,
      uses: medicine.uses,
      dosage: medicine.dosage,
      sideEffects: medicine.sideEffects,
      contraindications: medicine.contraindications,
      interactions: medicine.interactions,
      precautions: medicine.precautions,
      form: medicine.form,
      strength: medicine.strength,
      manufacturer: medicine.manufacturer,
      price: medicine.price,
      prescription: medicine.prescription,
      schedule: medicine.schedule,
    }))

    return NextResponse.json({
      success: true,
      medicines: formattedResults,
      totalResults: formattedResults.length,
      query: query,
      language: language,
    })

  } catch (error) {
    console.error("Drug info API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while searching medicines",
        medicines: [],
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const category = searchParams.get("category")

    if (id) {
      // Get specific medicine by ID
      const medicine = getMedicineById(id)
      
      if (!medicine) {
        return NextResponse.json(
          {
            success: false,
            error: "Medicine not found",
            medicine: null,
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        medicine: medicine,
      })
    }

    if (category) {
      // Get medicines by category
      const medicines = getMedicinesByCategory(category)
      
      return NextResponse.json({
        success: true,
        medicines: medicines,
        category: category,
        totalResults: medicines.length,
        categories: [...new Set(medicinesDataset.map(m => m.category))],
      })
    }

    // Return all available categories and some sample medicines
    const categories = [...new Set(medicinesDataset.map(m => m.category))]
    const sampleMedicines = medicinesDataset.slice(0, 5) // First 5 medicines as samples
    
    return NextResponse.json({
      success: true,
      categories: categories,
      sampleMedicines: sampleMedicines,
      totalMedicines: medicinesDataset.length,
      message: "Use POST /api/drug-info with {query: 'medicine name'} to search, or GET with ?category=CategoryName or ?id=medicineId",
    })

  } catch (error) {
    console.error("Drug info GET API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}
