"use client"
import { useState, useEffect } from "react"
import { FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi"
import { motion } from "framer-motion"
import { classData } from "@/data/classData"
import { toast, Toaster } from "react-hot-toast"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import Image from "next/image"

export default function ViewQuestions() {
  // State for questions and loading
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    class: "",
    subject: "",
    unit: "",
    exercise: "",
    type: "all",
    timestamp: Date.now().toString(), // Add timestamp
  })

  // State for editing
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [editedText, setEditedText] = useState("")
  const [editedOptions, setEditedOptions] = useState(["", "", "", ""])
  const [editedCorrectOption, setEditedCorrectOption] = useState("")
  const [editedParts, setEditedParts] = useState(["", ""])
  const [editedSelectedPart, setEditedSelectedPart] = useState("")

  // Helper function to get array name
  const getArrayName = () => {
    if (filters.class === "9th") {
      return `ninth${filters.subject.replace(/\s+/g, "")}`
    } else if (filters.class === "10th") {
      return filters.subject.toLowerCase() === "biology"
        ? "biologyQuestions"
        : `tenth${filters.subject.replace(/\s+/g, "")}`
    }
    return ""
  }

  const preserveLineBreaks = (text) => {
    return {
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      lineHeight: "1.5",
    }
  }

  // Get available classes - direct access to object keys
  const classes = Object.keys(classData || {})

  // Get subjects for selected class
  const subjects = filters.class && classData?.[filters.class]?.subjects ? classData[filters.class].subjects : []

  // Get units/chapters for selected subject
  const units =
    filters.subject && filters.class && classData?.[filters.class]?.chapters?.[filters.subject]
      ? classData[filters.class].chapters[filters.subject]
      : []

  // Get exercises/topics for selected unit
  const exercises = (() => {
    try {
      if (filters.unit && filters.class && filters.subject && classData) {
        const topicsData = classData[filters.class]?.topics
        const subjectTopics = topicsData?.[filters.subject]
        return subjectTopics?.[filters.unit] || []
      }
      return []
    } catch (error) {
      console.error("Error accessing exercises:", error)
      return []
    }
  })()

  // Helper function to ensure parts is an array
  const ensurePartsArray = (parts) => {
    if (!parts) return ["", ""] // Return empty array for editing

    // If it's already an array, return it
    if (Array.isArray(parts)) return parts

    // If it's a string (JSON), try to parse it
    if (typeof parts === "string") {
      try {
        const parsed = JSON.parse(parts)
        return Array.isArray(parsed) ? parsed : ["", ""]
      } catch (e) {
        console.error("Error parsing parts:", e)
        return ["", ""]
      }
    }

    // Default fallback
    return ["", ""]
  }

  // Handle edit click
  const handleEditClick = (question) => {
    setEditingQuestion({
      ...question,
      images: question.images || [], // Ensure images array exists
    })
    setEditedText(question.text)
    if (question.type === "mcqs") {
      setEditedOptions(question.options)
      setEditedCorrectOption(question.options.indexOf(question.answer).toString())
    }
    if (question.type === "long" || question.type.includes("long")) {
      const partsArray = ensurePartsArray(question.parts)
      setEditedParts(partsArray)
      const answerIndex = partsArray.findIndex((part) => part === question.answer)
      setEditedSelectedPart(answerIndex >= 0 ? answerIndex.toString() : "0")
    }
  }

  // Fetch questions when filters change
  const fetchQuestions = async () => {
    if (!filters.class || !filters.subject) return

    setLoading(true)
    try {
      // Fix parameter names to match the API expectations
      const params = new URLSearchParams({
        class: filters.class,
        subject: filters.subject,
        ...(filters.unit && { unit: filters.unit }), // Changed from chapter to unit
        ...(filters.exercise && { exercise: filters.exercise }), // Changed from topic to exercise
        ...(filters.type !== "all" && { type: filters.type }), // Only include type if not "all"
        ...(filters.search && { search: filters.search }),
        timestamp: Date.now().toString(), // Add timestamp to prevent caching
      })

      const apiUrl = "https://edu.largifysolutions.com/api-questions.php"
      const response = await fetch(`${apiUrl}?${params}`, {
        cache: "no-store", // Prevent caching
      })

      if (!response.ok) {
        throw new Error("Failed to fetch questions")
      }

      const data = await response.json()
      console.log("Fetched questions:", data) // Log fetched data

      // Process the questions to ensure parts are properly formatted
      const processedData = data.map((question) => {
        if ((question.type === "long" || question.type.includes("long")) && question.parts) {
          return {
            ...question,
            parts: ensurePartsArray(question.parts),
          }
        }
        return question
      })

      setQuestions(processedData)
    } catch (error) {
      console.error("Error fetching questions:", error)
      toast.error("Failed to fetch questions")
    } finally {
      setLoading(false)
    }
  }

  // Update question
  const handleSaveEdit = async () => {
    try {
      const updatedQuestion = {
        ...editingQuestion, // Keep all existing fields including images
        text: editedText,
        // Update type-specific fields
        ...(editingQuestion.type === "mcqs" && {
          options: editedOptions,
          answer: editedOptions[Number.parseInt(editedCorrectOption)],
        }),
        ...((editingQuestion.type === "long" || editingQuestion.type.includes("long")) && {
          parts: editedParts.every((part) => part === "") ? null : editedParts,
          answer: editedParts.every((part) => part === "") ? null : editedParts[Number.parseInt(editedSelectedPart)],
        }),
        // Include images in the update
        images: editingQuestion.images || [],
      }

      // Use the PHP API endpoint with POST
      const apiUrl = "https://edu.largifysolutions.com/api-questions.php"
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "update",
          question: updatedQuestion,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update question")
      }

      toast.success("Question updated successfully!")
      setEditingQuestion(null)
      setFilters((prev) => ({ ...prev, timestamp: Date.now().toString() }))
    } catch (error) {
      console.error("Error updating question:", error)
      toast.error(error.message)
    }
  }

  const handleDeleteImage = async (index) => {
    try {
      const response = await fetch("https://edu.largifysolutions.com/api-questions.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete-image",
          questionId: editingQuestion.id,
          imageIndex: index,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete image")
      }

      // Update local state
      const updatedImages = [...editingQuestion.images]
      updatedImages.splice(index, 1)
      setEditingQuestion({ ...editingQuestion, images: updatedImages })

      toast.success("Image deleted successfully!")
    } catch (error) {
      console.error("Error deleting image:", error)
      toast.error(error.message)
    }
  }

  // ... existing code ...

  const handleImageUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      const formData = new FormData()
      // Append each file individually with the same field name
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i])
      }

      const uploadResponse = await fetch("https://edu.largifysolutions.com/upload-image.php", {
        method: "POST",
        body: formData,
        // Let browser set the Content-Type with boundary automatically
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}))
        throw new Error(errorData.message || `Upload failed with status ${uploadResponse.status}`)
      }

      const uploadedImages = await uploadResponse.json()

      // Validate response structure
      if (!uploadedImages.urls || !Array.isArray(uploadedImages.urls)) {
        throw new Error("Invalid response format from server")
      }

      // Update local state with new images
      const updatedImages = [...(editingQuestion?.images || []), ...uploadedImages.urls]
      setEditingQuestion((prev) => ({ ...prev, images: updatedImages }))

      toast.success("Images uploaded successfully!")
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error(`Image upload failed: ${error.message}`)
    } finally {
      e.target.value = "" // Reset file input
    }
  }

  // ... rest of the code ...

  // Delete question
  const handleDelete = async (question) => {
    if (!confirm("Are you sure you want to delete this question?")) return

    try {
      // Use POST instead of DELETE since the server might have CORS issues with DELETE
      const apiUrl = "https://edu.largifysolutions.com/api-questions.php"

      const response = await fetch(apiUrl, {
        method: "POST", // Changed from DELETE to POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete", // Add an action parameter to indicate this is a delete operation
          questionId: question.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Network response was not ok" }))
        throw new Error(errorData.error || `Failed to delete question: ${response.status}`)
      }

      toast.success("Question deleted successfully!")
      // Refresh the questions list
      setFilters((prev) => ({ ...prev }))
    } catch (error) {
      console.error("Error deleting question:", error)
      toast.error(error.message || "Failed to delete question. Please try again later.")
    }
  }

  // Add this function after the handleDelete function
  const handleRefresh = () => {
    // Refresh questions by triggering a filter change
    setFilters((prev) => ({ ...prev, timestamp: Date.now().toString() }))
    toast.success("Refreshing questions...")
  }

  // Utility functions
  const getStepHeadingClass = (color1, color2) => {
    return `text-xl font-bold bg-gradient-to-r from-${color1} to-${color2} bg-clip-text text-transparent pb-2 border-b-2 border-${color1}-100 inline-block mb-4`
  }

  const shouldUseUrduFont = (subject) => {
    const urduSubjects = ["Urdu", "Quran", "Islamiat"]
    return urduSubjects.includes(subject)
  }

  // Function to get question types based on subject and class
  const getQuestionTypes = (subject, classLevel) => {
    // Define question types for English subject
    const englishQuestionTypes = {
      "9th": [
        "mcqs",
        "short",
        "e_to_u",
        "summary",
        "w_sentence",
        "letter",
        "story",
        "dialogue",
        "comprehense",
        "u_to_e",
        "act_pass",
      ],
      "10th": ["mcqs", "short", "e_to_u", "summary", "essay", "dir_ind", "pair_o_w", "u_to_e"],
      "11th": [
        "mcqs",
        "sq_book_i",
        "sqBoPlays",
        "sqBokPoems",
        "letter",
        "application",
        "story",
        "exp_poems",
        "punctuation",
        "pair_o_w",
        "e_to_u",
      ],
      "12th": ["mcqs", "sq_ii_pr_i", "mr_chips", "e_to_u", "essay", "idioms", "u_to_e"],
    }

    // Define question types for Urdu subject
    const urduQuestionTypes = {
      "9th": [
        "mcqs",
        "poet_ex",
        "proseExp",
        "short",
        "summary",
        "cen_idea",
        "letter",
        "application",
        "story",
        "dialogue",
        "sen_corr",
        "provrb_exp",
      ],
      "10th": ["mcqs", "poet_ex", "provrb_exp", "short", "summary", "essay", "comprehense"],
      "11th": [
        "mcqs",
        "poet_ex",
        "ghazl_ex",
        "proseExp",
        "poem_summ",
        "lessonSumm",
        "dialogue",
        "report",
        "receipt",
        "application",
        "precis",
      ],
      "12th": ["mcqs", "poet_ex", "ghazl_ex", "proseExp", "poem_summ", "lessonSumm", "essay", "letter"],
    }

    // Define question types for Islamic Studies
    const islamiyatQuestionTypes = ["mcqs", "short", "long", "hadith", "note", "ayat"]

    // Define question types for Tarjuma Quran
    const tarjumaQuranQuestionTypes = ["mcqs", "short", "q_w_m", "ayat", "note"]

    // Define question types for Pakistan Studies
    const pakStudiesQuestionTypes = ["mcqs", "short", "long"]

    // Define question types for Science subjects
    const scienceMathQuestionTypes = ["mcqs", "short", "long"]

    // Check subject to determine which question types to return
    if (subject === "English") {
      return englishQuestionTypes[classLevel] || ["mcqs", "short", "long"]
    } else if (subject === "Urdu") {
      return urduQuestionTypes[classLevel] || ["mcqs", "short", "long"]
    } else if (["Islamiat", "Islamyat"].includes(subject)) {
      return islamiyatQuestionTypes
    } else if (["Tarjuma Quran", "Quran", "ترجمہ قرآن"].includes(subject)) {
      return tarjumaQuranQuestionTypes
    } else if (["Pakistan Studies", "Pak Studies"].includes(subject)) {
      return pakStudiesQuestionTypes
    } else if (
      ["Physics", "Chemistry", "Biology", "Mathematics", "Math", "Computer", "Computer Science"].includes(subject)
    ) {
      return scienceMathQuestionTypes
    }

    // Default question types
    return ["mcqs", "short", "long"]
  }

  // Function to convert question type codes to user-friendly display names
  const getDisplayNameForType = (type) => {
    const displayNames = {
      // English subject question types
      mcqs: "MCQs",
      short: "Short",
      e_to_u: "English To Urdu",
      summary: "Summary",
      w_sentence: "Word Sentence",
      letter: "Letter",
      story: "Story",
      dialogue: "Dialogue",
      comprehense: "Comprehension",
      u_to_e: "Urdu To English",
      act_pass: "Active Passive",
      essay: "Essay",
      dir_ind: "Direct Indirect",
      pair_o_w: "Pair of Words",
      sq_book_i: "Short Questions (Book I)",
      sqBoPlays: "Short Questions (Plays)",
      sqBokPoems: "Short Questions (Poems)",
      application: "Application",
      exp_poems: "Explain Poems",
      punctuation: "Punctuation",
      sq_ii_pr_i: "Short Questions (Book II)",
      mr_chips: "Mr. Chips",
      idioms: "Idioms",

      // Urdu subject question types
      poet_ex: "Poetry Explanation",
      proseExp: "Prose Explanation",
      cen_idea: "Central Idea",
      sen_corr: "Sentence Correction",
      provrb_exp: "Proverb Explanation",
      ghazl_ex: "Ghazal Explanation",
      poem_summ: "Poem Summary",
      lessonSumm: "Lesson Summary",
      report: "Report",
      receipt: "Receipt",
      precis: "Precis",

      // Islamic Studies question types
      hadith: "Hadith",
      note: "Note",
      ayat: "Ayat",

      // Tarjuma Quran question types
      q_w_m: "Quranic Words Meaning",

      // Science and Math question types
      long: "Long",
      long_part_a: "Long (Part A)",
      long_part_b: "Long (Part B)",
    }

    return (
      displayNames[type] ||
      type
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
  }

  // Use questions directly
  const filteredQuestions = questions

  useEffect(() => {
    fetchQuestions()
  }, [filters.class, filters.subject, filters.unit, filters.exercise, filters.type, filters.search, filters.timestamp]) // Add explicit dependencies

  // Update the question display section in the return statement
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50 py-12">
        <Toaster position="top-center" />
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
              Question Bank
            </h1>
            <p className="text-gray-600">Explore and manage your question collection</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white">
            {/* Search and Filter Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-96">
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        search: e.target.value,
                      }))
                    }
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all duration-200"
                  />
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                </div>
                <div className="bg-violet-100 px-4 py-2 rounded-xl">
                  <span className="text-violet-800 font-semibold">
                    {filteredQuestions.length} {filteredQuestions.length === 1 ? "Question" : "Questions"}
                  </span>
                </div>
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl hover:bg-blue-200 transition-colors duration-200"
                >
                  Refresh Questions
                </button>
              </div>
              {filters.subject && (
                <select
                  value={filters.type}
                  onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full md:w-48 py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all duration-200"
                >
                  <option value="all">All Types</option>
                  {getQuestionTypes(filters.subject, filters.class).map((type) => (
                    <option key={type} value={type}>
                      {getDisplayNameForType(type)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Selection Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Class Selection */}
              <div>
                <h2 className={getStepHeadingClass("blue-600", "indigo-600")}>Select Class</h2>
                <div className="space-y-2">
                  {classes.map((className) => (
                    <motion.div
                      key={className}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-lg cursor-pointer ${
                        filters.class === className
                          ? "bg-blue-50 border-2 border-blue-500"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          class: className,
                          subject: "",
                          unit: "",
                          exercise: "",
                          type: "all", // Reset type to "all" when subject changes
                        }))
                      }
                    >
                      <span className="font-medium">{className}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Subject Selection */}
              {filters.class && (
                <div>
                  <h2 className={getStepHeadingClass("cyan-600", "teal-600")}>Select Subject</h2>
                  <div className="space-y-2">
                    {subjects.map((subject) => (
                      <motion.div
                        key={subject}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-lg cursor-pointer ${
                          filters.subject === subject
                            ? "bg-cyan-50 border-2 border-cyan-500"
                            : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                        }`}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            subject: subject,
                            unit: "",
                            exercise: "",
                          }))
                        }
                      >
                        <span className="font-medium">{subject}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unit Selection */}
              {filters.subject && (
                <div>
                  <h2 className={getStepHeadingClass("indigo-600", "violet-600")}>Select Unit</h2>
                  <div className="space-y-2">
                    {units.map((unit, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-lg cursor-pointer ${
                          filters.unit === unit
                            ? "bg-indigo-50 border-2 border-indigo-500"
                            : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                        }`}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            unit: unit,
                            exercise: "",
                          }))
                        }
                      >
                        <span
                          className={`font-medium ${
                            shouldUseUrduFont(filters.subject) ? "font-nastaliq text-right text-xl" : ""
                          }`}
                        >
                          {unit}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exercise Selection */}
              {filters.unit && (
                <div>
                  <h2 className={getStepHeadingClass("violet-600", "purple-600")}>Select Exercise</h2>
                  <div className="space-y-2">
                    {exercises.map((exercise, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-lg cursor-pointer ${
                          filters.exercise === exercise
                            ? "bg-violet-50 border-2 border-violet-500"
                            : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                        }`}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            exercise: exercise,
                          }))
                        }
                      >
                        <span
                          className={`font-medium ${
                            shouldUseUrduFont(filters.subject) ? "font-nastaliq text-right text-xl" : ""
                          }`}
                        >
                          {exercise}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-8">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No questions found</p>
                </div>
              ) : (
                filteredQuestions.map((question) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={question.id}
                    className="group relative bg-white rounded-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-violet-200"
                  >
                    <div className="absolute -left-2 top-6 w-1 h-20 bg-gradient-to-b from-blue-500 to-violet-500 rounded-r transform transition-all duration-300 group-hover:h-24 group-hover:from-blue-400 group-hover:to-violet-400" />

                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        {/* Question Text and Images */}
                        <div className="mb-6">
                          {/* <p className={`text-gray-800 text-xl leading-relaxed ${question.medium === "URDU MEDIUM" ? "font-nastaliq text-right text-2xl" : ""}`}>
                            {question.text}
                          </p> */}

                          {/* Display images if they exist */}
                          {question.images?.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-4">
                              {question.images.map((img, index) => (
                                <div key={index} className="relative">
                                  <Image
                                    src={img || "/placeholder.svg"}
                                    alt={`Question image ${index + 1}`}
                                    width={200}
                                    height={150}
                                    className="rounded-lg object-contain max-h-48 border border-gray-200"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {editingQuestion?.id === question.id ? (
                          <div className="space-y-4">
                            <textarea
                              value={editedText}
                              onChange={(e) => setEditedText(e.target.value)}
                              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                              rows="3"
                            />

                            {/* Add this image editing section */}
                            <div className="space-y-3">
                              <h3 className="font-medium text-gray-700">Images:</h3>
                              {editingQuestion.images?.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                  {editingQuestion.images.map((img, index) => (
                                    <div key={index} className="relative group">
                                      <Image
                                        src={img || "/placeholder.svg"}
                                        alt={`Question image ${index}`}
                                        width={150}
                                        height={100}
                                        className="rounded-lg object-cover border border-gray-200"
                                      />
                                      <button
                                        onClick={() => handleDeleteImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                      >
                                        <FiTrash2 size={14} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <label className="block">
                                <span className="sr-only">Add Images</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleImageUpload}
                                  className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
                                />
                              </label>
                            </div>

                            {question.type === "mcqs" && (
                              <div className="space-y-3">
                                {editedOptions.map((option, index) => (
                                  <div key={index} className="flex items-center gap-3">
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...editedOptions]
                                        newOptions[index] = e.target.value
                                        setEditedOptions(newOptions)
                                      }}
                                      className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                                    />
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="radio"
                                        name="correctOption"
                                        value={index}
                                        checked={editedCorrectOption === String(index)}
                                        onChange={(e) => setEditedCorrectOption(e.target.value)}
                                        className="text-violet-500 focus:ring-violet-500"
                                      />
                                      <span className="text-sm text-gray-600">Correct</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            {(question.type === "long" || question.type.includes("long")) && (
                              <div className="space-y-3">
                                <h3 className="font-medium text-gray-700 mb-2">Question Parts:</h3>
                                {editedParts.map((part, index) => (
                                  <div key={index} className="flex items-start gap-3">
                                    <textarea
                                      value={part}
                                      onChange={(e) => {
                                        const newParts = [...editedParts]
                                        newParts[index] = e.target.value
                                        setEditedParts(newParts)
                                      }}
                                      className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500"
                                      rows="3"
                                      placeholder={`Part ${String.fromCharCode(65 + index)}`}
                                    />
                                    <div className="flex items-center gap-2 mt-3">
                                      <input
                                        type="radio"
                                        name="selectedPart"
                                        value={index}
                                        checked={editedSelectedPart === String(index)}
                                        onChange={(e) => setEditedSelectedPart(e.target.value)}
                                        className="text-violet-500 focus:ring-violet-500"
                                      />
                                      <span className="text-sm text-gray-600">Correct</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => setEditingQuestion(null)}
                                className="px-6 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors duration-200"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleSaveEdit}
                                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors duration-200"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                              <span className="px-4 py-2 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold shadow-sm">
                                {question.type.toUpperCase()}
                              </span>
                              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold shadow-sm">
                                {question.chapter}
                              </span>
                              <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold shadow-sm">
                                {question.topic}
                              </span>
                              <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold shadow-sm">
                                {question.source}
                              </span>
                            </div>
                            <p
                              style={preserveLineBreaks(question.text)}
                              className={`text-gray-800 text-xl leading-relaxed mb-6 ${
                                question.medium === "URDU MEDIUM" ? "font-nastaliq text-right text-2xl" : ""
                              }`}
                            >
                              {question.text}
                            </p>
                            {question.type === "mcqs" && (
                              <div className="ml-6 space-y-3">
                                {question.options.map((option, index) => (
                                  <div
                                    key={index}
                                    className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${
                                      option === question.answer
                                        ? "bg-green-100 text-green-800 shadow-sm"
                                        : "hover:bg-gray-50 text-gray-700"
                                    } ${question.medium === "URDU MEDIUM" ? "font-nastaliq text-right text-xl" : ""}`}
                                  >
                                    <span
                                      className={`w-10 h-10 flex items-center justify-center rounded-full ${
                                        option === question.answer
                                          ? "bg-green-200 text-green-800 border-2 border-green-300"
                                          : "bg-white border-2 border-gray-200"
                                      }`}
                                    >
                                      {String.fromCharCode(65 + index)}
                                    </span>
                                    <span className="flex-1">{option}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {(question.type === "long" || question.type.includes("long")) &&
                              question.parts &&
                              question.parts.some((part) => part && part.trim() !== "") && (
                                <div className="mt-6 space-y-4">
                                  <h3 className="font-medium text-gray-700 mb-2">
                                    {shouldUseUrduFont(question.subject) ? "سوال کے حصے:" : "Question Parts:"}
                                  </h3>
                                  <div className="ml-6 space-y-4">
                                    {ensurePartsArray(question.parts).map(
                                      (part, index) =>
                                        part &&
                                        part.trim() !== "" && (
                                          <div
                                            key={index}
                                            className={`p-4 rounded-xl border ${
                                              part === question.answer
                                                ? "bg-green-50 border-green-200 text-green-800"
                                                : "bg-gray-50 border-gray-200 text-gray-700"
                                            } ${
                                              question.medium === "URDU MEDIUM"
                                                ? "font-nastaliq text-right text-xl"
                                                : ""
                                            }`}
                                          >
                                            <div className="flex items-start gap-3">
                                              <span
                                                className={`min-w-10 h-10 flex items-center justify-center rounded-full ${
                                                  part === question.answer
                                                    ? "bg-green-200 text-green-800 border-2 border-green-300"
                                                    : "bg-white border-2 border-gray-200"
                                                }`}
                                              >
                                                {shouldUseUrduFont(question.subject)
                                                  ? index === 0
                                                    ? "ا"
                                                    : index === 1
                                                      ? "ب"
                                                      : index === 2
                                                        ? "ج"
                                                        : "د"
                                                  : String.fromCharCode(65 + index)}
                                              </span>
                                              <div className="flex-1">
                                                <p className="text-lg">{part}</p>
                                                {part === question.answer && (
                                                  <div className="mt-2 text-sm font-medium text-green-600">
                                                    {shouldUseUrduFont(question.subject)
                                                      ? "درست جواب"
                                                      : "Correct Answer"}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ),
                                    )}
                                  </div>
                                </div>
                              )}
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditClick(question)}
                          className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md"
                        >
                          <FiEdit2 className="w-6 h-6" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(question)}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-md"
                        >
                          <FiTrash2 className="w-6 h-6" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

// Add this after the handleEditClick function
// const handleDeleteImage = async (index) => {
//   try {
//     const response = await fetch('https://edu.largifysolutions.com/api-questions.php', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         action: 'delete-image',
//         questionId: editingQuestion.id,
//         imageIndex: index
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.error || 'Failed to delete image');
//     }

//     // Update local state
//     const updatedImages = [...editingQuestion.images];
//     updatedImages.splice(index, 1);
//     setEditingQuestion({...editingQuestion, images: updatedImages});

//     toast.success('Image deleted successfully!');
//   } catch (error) {
//     console.error('Error deleting image:', error);
//     toast.error(error.message);
//   }
// };

// const handleImageUpload = async (e) => {
//   const files = e.target.files;
//   if (!files || files.length === 0) return;

//   try {
//     // Create FormData to handle file uploads
//     const formData = new FormData();
//     for (let i = 0; i < files.length; i++) {
//       formData.append('images[]', files[i]);
//     }

//     // Upload images to your server (you'll need an endpoint for this)
//     const uploadResponse = await fetch('https://your-image-upload-endpoint.com', {
//       method: 'POST',
//       body: formData,
//     });

//     const uploadedImages = await uploadResponse.json();

//     if (!uploadResponse.ok) {
//       throw new Error(uploadedImages.error || 'Failed to upload images');
//     }

//     // Update local state with new images
//     const updatedImages = [...(editingQuestion.images || []), ...uploadedImages.urls];
//     setEditingQuestion({...editingQuestion, images: updatedImages});

//     toast.success('Images uploaded successfully!');
//   } catch (error) {
//     console.error('Error uploading images:', error);
//     toast.error(error.message);
//   } finally {
//     e.target.value = ''; // Reset file input
//   }
// };

// Update the question display to show images
const renderQuestion = (question) => {
  return (
    <div className="space-y-4">
      <div className="text-gray-800">{question.text}</div>

      {/* Display images if they exist */}
      {question.images?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {question.images.map((img, index) => (
            <div key={index} className="relative group">
              <Image
                src={img || "/placeholder.svg"}
                alt={`Question image ${index}`}
                width={100}
                height={100}
                className="rounded-md object-cover"
              />
              {editingQuestion?.id === question.id && (
                <button
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiTrash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Render options or parts based on question type */}
      {question.type === "mcqs" && question.options && (
        <div className="space-y-2">
          {question.options.map((option, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="radio" checked={question.correctOption === String(i)} readOnly className="w-4 h-4" />
              <span>{option}</span>
            </div>
          ))}
        </div>
      )}

      {question.type === "long" && question.parts && (
        <div className="space-y-2">
          {ensurePartsArray(question.parts).map((part, i) => (
            <div key={i} className="flex items-start gap-2">
              <input type="radio" checked={question.selectedPart === String(i)} readOnly className="w-4 h-4 mt-1" />
              <span>{part}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Update the edit modal to include image handling
const renderEditModal = () => {
  if (!editingQuestion) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Question</h2>

        {/* Question Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Question Text</label>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        {/* Image handling section */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Images</label>
          {editingQuestion.images?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {editingQuestion.images.map((img, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`Question image ${index}`}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="w-full" />
        </div>

        {/* ... rest of the edit modal ... */}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setEditingQuestion(null)} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-500 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
