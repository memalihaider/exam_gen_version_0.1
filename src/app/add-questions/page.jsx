"use client"
import { useState } from "react"
import { toast, Toaster } from "react-hot-toast"
import { motion } from "framer-motion"
import { classData } from "@/data/classData"
import Link from "next/link"
import { nastaliq } from "../fonts"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/UserContext"
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

// Add this new component for math input helper
const MathInputHelper = ({ onInsert }) => {
  const mathSymbols = [
    { label: 'Fraction', latex: '\\frac{a}{b}', display: '\\frac{a}{b}', friendly: 'a/b' },
    { label: 'Power', latex: 'x^{n}', display: 'x^{n}', friendly: 'x²' },
    { label: 'Square Root', latex: '\\sqrt{x}', display: '\\sqrt{x}', friendly: '√x' },
    { label: 'Cube Root', latex: '\\sqrt[3]{x}', display: '\\sqrt[3]{x}', friendly: '∛x' },
    { label: 'Fourth Root', latex: '\\sqrt[4]{x}', display: '\\sqrt[4]{x}', friendly: '∜x' },
    { label: 'Subscript', latex: 'x_{n}', display: 'x_{n}', friendly: 'x₁' },
    { label: 'Sum', latex: '\\sum_{i=1}^{n}', display: '\\sum_{i=1}^{n}', friendly: 'Σ' },
    { label: 'Product', latex: '\\prod_{i=1}^{n}', display: '\\prod_{i=1}^{n}', friendly: 'Π' },
    { label: 'Integral', latex: '\\int_{a}^{b}', display: '\\int_{a}^{b}', friendly: '∫' },
    { label: 'Partial', latex: '\\partial', display: '\\partial', friendly: '∂' },
    { label: 'Nabla', latex: '\\nabla', display: '\\nabla', friendly: '∇' },
    { label: 'Limit', latex: '\\lim_{x \\to \\infty}', display: '\\lim_{x \\to \\infty}', friendly: 'lim' },
    { label: 'Alpha', latex: '\\alpha', display: '\\alpha', friendly: 'α' },
    { label: 'Beta', latex: '\\beta', display: '\\beta', friendly: 'β' },
    { label: 'Gamma', latex: '\\gamma', display: '\\gamma', friendly: 'γ' },
    { label: 'Delta', latex: '\\delta', display: '\\delta', friendly: 'δ' },
    { label: 'Epsilon', latex: '\\epsilon', display: '\\epsilon', friendly: 'ε' },
    { label: 'Theta', latex: '\\theta', display: '\\theta', friendly: 'θ' },
    { label: 'Lambda', latex: '\\lambda', display: '\\lambda', friendly: 'λ' },
    { label: 'Mu', latex: '\\mu', display: '\\mu', friendly: 'μ' },
    { label: 'Pi', latex: '\\pi', display: '\\pi', friendly: 'π' },
    { label: 'Sigma', latex: '\\sigma', display: '\\sigma', friendly: 'σ' },
    { label: 'Phi', latex: '\\phi', display: '\\phi', friendly: 'φ' },
    { label: 'Omega', latex: '\\omega', display: '\\omega', friendly: 'ω' },
    { label: 'Plus/Minus', latex: '\\pm', display: '\\pm', friendly: '±' },
    { label: 'Minus/Plus', latex: '\\mp', display: '\\mp', friendly: '∓' },
    { label: 'Multiply', latex: '\\times', display: '\\times', friendly: '×' },
    { label: 'Divide', latex: '\\div', display: '\\div', friendly: '÷' },
    { label: 'Not Equal', latex: '\\neq', display: '\\neq', friendly: '≠' },
    { label: 'Less Equal', latex: '\\leq', display: '\\leq', friendly: '≤' },
    { label: 'Greater Equal', latex: '\\geq', display: '\\geq', friendly: '≥' },
    { label: 'Approximately', latex: '\\approx', display: '\\approx', friendly: '≈' },
    { label: 'Infinity', latex: '\\infty', display: '\\infty', friendly: '∞' },
    { label: 'Degree', latex: '^\\circ', display: '^\\circ', friendly: '°' },
    { label: 'One Half', latex: '\\frac{1}{2}', display: '\\frac{1}{2}', friendly: '½' },
    { label: 'One Third', latex: '\\frac{1}{3}', display: '\\frac{1}{3}', friendly: '⅓' },
    { label: 'Two Thirds', latex: '\\frac{2}{3}', display: '\\frac{2}{3}', friendly: '⅔' },
    { label: 'One Quarter', latex: '\\frac{1}{4}', display: '\\frac{1}{4}', friendly: '¼' },
    { label: 'Three Quarters', latex: '\\frac{3}{4}', display: '\\frac{3}{4}', friendly: '¾' }
  ];

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h4 className="font-medium mb-3 text-gray-700">Math Symbols (Click to insert):</h4>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {mathSymbols.map((symbol, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onInsert(symbol.friendly)}
            className="p-3 bg-white border border-gray-300 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors text-center flex flex-col items-center"
            title={symbol.label}
          >
            <div className="text-lg font-bold text-blue-600 mb-1">{symbol.friendly}</div>
            <div className="text-xs text-gray-500">{symbol.label}</div>
          </button>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-blue-800 font-medium mb-2">Text-to-Symbol Conversions:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
          <div>
            <strong>Powers:</strong>
            <ul className="ml-4 space-y-1">
              <li>• "x square" → x²</li>
              <li>• "x cube" → x³</li>
              <li>• "x power 5" → x⁵</li>
            </ul>
          </div>
          <div>
            <strong>Roots:</strong>
            <ul className="ml-4 space-y-1">
              <li>• "square root of x" → √x</li>
              <li>• "cube root of x" → ∛x</li>
              <li>• "fourth root of x" → ∜x</li>
            </ul>
          </div>
          <div>
            <strong>Greek Letters:</strong>
            <ul className="ml-4 space-y-1">
              <li>• "alpha" → α</li>
              <li>• "beta" → β</li>
              <li>• "pi" → π</li>
              <li>• "theta" → θ</li>
            </ul>
          </div>
          <div>
            <strong>Operators:</strong>
            <ul className="ml-4 space-y-1">
              <li>• "plus minus" → ±</li>
              <li>• "times" → ×</li>
              <li>• "divide" → ÷</li>
              <li>• "not equal" → ≠</li>
            </ul>
          </div>
          <div>
            <strong>Subscripts:</strong>
            <ul className="ml-4 space-y-1">
              <li>• "x sub 1" → x₁</li>
              <li>• "a sub 2" → a₂</li>
            </ul>
          </div>
          <div>
            <strong>Functions:</strong>
            <ul className="ml-4 space-y-1">
              <li>• "sum" → Σ</li>
              <li>• "integral" → ∫</li>
              <li>• "infinity" → ∞</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced function to handle text input with comprehensive mathematical notation conversion
const handleTextInput = (e, setValue) => {
  const value = e.target.value;
  const cursorPosition = e.target.selectionStart;
  let newValue = value;
  let hasChanges = false;

  // Define superscript mappings
  const superscriptMap = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
  };

  // Define subscript mappings
  const subscriptMap = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };

  // Mathematical notation conversions
  const conversions = [
    // Powers - specific cases first
    { pattern: /([a-zA-Z])\s*square/gi, replacement: '$1²' },
    { pattern: /([a-zA-Z])\s*cube/gi, replacement: '$1³' },
    { pattern: /([a-zA-Z])\s*power\s*(\d+)/gi, replacement: (match, base, power) => {
      return base + (superscriptMap[power] || `^${power}`);
    }},
    
    // Roots
    { pattern: /square\s*root\s*of\s*([a-zA-Z0-9]+)/gi, replacement: '√$1' },
    { pattern: /cube\s*root\s*of\s*([a-zA-Z0-9]+)/gi, replacement: '∛$1' },
    { pattern: /fourth\s*root\s*of\s*([a-zA-Z0-9]+)/gi, replacement: '∜$1' },
    { pattern: /root\s*([a-zA-Z0-9]+)/gi, replacement: '√$1' },
    
    // Greek letters
    { pattern: /\balpha\b/gi, replacement: 'α' },
    { pattern: /\bbeta\b/gi, replacement: 'β' },
    { pattern: /\bgamma\b/gi, replacement: 'γ' },
    { pattern: /\bdelta\b/gi, replacement: 'δ' },
    { pattern: /\bepsilon\b/gi, replacement: 'ε' },
    { pattern: /\bzeta\b/gi, replacement: 'ζ' },
    { pattern: /\beta\b/gi, replacement: 'η' },
    { pattern: /\btheta\b/gi, replacement: 'θ' },
    { pattern: /\biota\b/gi, replacement: 'ι' },
    { pattern: /\bkappa\b/gi, replacement: 'κ' },
    { pattern: /\blambda\b/gi, replacement: 'λ' },
    { pattern: /\bmu\b/gi, replacement: 'μ' },
    { pattern: /\bnu\b/gi, replacement: 'ν' },
    { pattern: /\bxi\b/gi, replacement: 'ξ' },
    { pattern: /\bomicron\b/gi, replacement: 'ο' },
    { pattern: /\bpi\b/gi, replacement: 'π' },
    { pattern: /\brho\b/gi, replacement: 'ρ' },
    { pattern: /\bsigma\b/gi, replacement: 'σ' },
    { pattern: /\btau\b/gi, replacement: 'τ' },
    { pattern: /\bupsilon\b/gi, replacement: 'υ' },
    { pattern: /\bphi\b/gi, replacement: 'φ' },
    { pattern: /\bchi\b/gi, replacement: 'χ' },
    { pattern: /\bpsi\b/gi, replacement: 'ψ' },
    { pattern: /\bomega\b/gi, replacement: 'ω' },
    
    // Mathematical operators
    { pattern: /\bplus\s*minus\b/gi, replacement: '±' },
    { pattern: /\bminus\s*plus\b/gi, replacement: '∓' },
    { pattern: /\btimes\b/gi, replacement: '×' },
    { pattern: /\bdivide\b/gi, replacement: '÷' },
    { pattern: /\bnot\s*equal\b/gi, replacement: '≠' },
    { pattern: /\bless\s*equal\b/gi, replacement: '≤' },
    { pattern: /\bgreater\s*equal\b/gi, replacement: '≥' },
    { pattern: /\bapprox\b/gi, replacement: '≈' },
    { pattern: /\binfinity\b/gi, replacement: '∞' },
    { pattern: /\bdegree\b/gi, replacement: '°' },
    
    // Mathematical functions
    { pattern: /\bsum\b/gi, replacement: 'Σ' },
    { pattern: /\bproduct\b/gi, replacement: 'Π' },
    { pattern: /\bintegral\b/gi, replacement: '∫' },
    { pattern: /\bpartial\b/gi, replacement: '∂' },
    { pattern: /\bnabla\b/gi, replacement: '∇' },
    
    // Fractions (simple cases)
    { pattern: /\bone\s*half\b/gi, replacement: '½' },
    { pattern: /\bone\s*third\b/gi, replacement: '⅓' },
    { pattern: /\btwo\s*thirds\b/gi, replacement: '⅔' },
    { pattern: /\bone\s*quarter\b/gi, replacement: '¼' },
    { pattern: /\bthree\s*quarters\b/gi, replacement: '¾' },
    
    // Subscripts
    { pattern: /([a-zA-Z])\s*sub\s*(\d+)/gi, replacement: (match, base, sub) => {
      return base + (subscriptMap[sub] || `_${sub}`);
    }}
  ];

  // Apply all conversions
  conversions.forEach(({ pattern, replacement }) => {
    if (pattern.test(newValue)) {
      if (typeof replacement === 'function') {
        newValue = newValue.replace(pattern, replacement);
      } else {
        newValue = newValue.replace(pattern, replacement);
      }
      hasChanges = true;
    }
  });

  if (hasChanges) {
    setValue(newValue);
    
    // Adjust cursor position
    setTimeout(() => {
      const newCursorPos = cursorPosition - (value.length - newValue.length);
      e.target.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  } else {
    setValue(value);
  }
};

// Add this function to render math in text
const renderMathText = (text) => {
  if (!text) return text;
  
  // Split text by math delimiters
  const parts = [];
  let currentIndex = 0;
  
  // Handle block math ($$...$$)
  const blockMathRegex = /\$\$([^$]+)\$\$/g;
  let blockMatch;
  
  while ((blockMatch = blockMathRegex.exec(text)) !== null) {
    // Add text before math
    if (blockMatch.index > currentIndex) {
      const beforeText = text.slice(currentIndex, blockMatch.index);
      parts.push(...renderInlineMath(beforeText));
    }
    
    // Add block math
    parts.push(
      <div key={`block-${blockMatch.index}`} className="my-2">
        <BlockMath math={blockMatch[1]} />
      </div>
    );
    
    currentIndex = blockMatch.index + blockMatch[0].length;
  }
  
  // Handle remaining text
  if (currentIndex < text.length) {
    const remainingText = text.slice(currentIndex);
    parts.push(...renderInlineMath(remainingText));
  }
  
  return parts.length > 0 ? parts : text;
};

const renderInlineMath = (text) => {
  const parts = [];
  let currentIndex = 0;
  
  // Handle inline math ($...$)
  const inlineMathRegex = /\$([^$]+)\$/g;
  let inlineMatch;
  
  while ((inlineMatch = inlineMathRegex.exec(text)) !== null) {
    // Add text before math
    if (inlineMatch.index > currentIndex) {
      parts.push(text.slice(currentIndex, inlineMatch.index));
    }
    
    // Add inline math
    parts.push(
      <InlineMath key={`inline-${inlineMatch.index}`} math={inlineMatch[1]} />
    );
    
    currentIndex = inlineMatch.index + inlineMatch[0].length;
  }
  
  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(text.slice(currentIndex));
  }
  
  return parts.length > 0 ? parts : [text];
};

export default function AddQuestions() {
  // Update the initial state to include parts for long questions and a flag for using parts
  const [questionData, setQuestionData] = useState({
    text: "",
    type: "mcqs",
    subject: "",
    class: "",
    unit: "",
    exercise: "",
    marks: "1",
    options: ["", "", "", ""],
    correctOption: "", // Changed from answer to correctOption for consistency
    source: "exercise",
    medium: "ENGLISH MEDIUM",
    statement: "Choose the correct option",
    // Add new fields for parts
    parts: ["", ""], // Default two parts for long questions
    selectedPart: "", // To track which part is selected as answer
    useParts: false, // New flag to determine if parts should be used

    images: [],
    imageFiles: [],
  })

  const [selectedUnit, setSelectedUnit] = useState(null)
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [showMathHelper, setShowMathHelper] = useState(false)
  const [questionTextRef, setQuestionTextRef] = useState(null)

  // Add this utility function to preserve line breaks in displayed text
  const preserveLineBreaks = (text) => {
    return {
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
    }
  }

  // Add this function near other utility functions, after the useState declarations
  const getQuestionTextStyle = (type) => {
    return {
      ...(type === "u_to_e" && {
        textAlign: "right",
        direction: "rtl",
        fontFamily: "Jameel Noori Nastaleeq, Noto Nastaliq Urdu, serif",
      }),
    }
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

  // Get available classes
  const classes = Object.keys(classData || {})

  // Update subjects with safety check
  const subjects =
    questionData.class && classData?.[questionData.class]?.subjects ? classData[questionData.class].subjects : []

  // Update units with safety check
  const units =
    questionData.subject && questionData.class && classData?.[questionData.class]?.chapters?.[questionData.subject]
      ? classData[questionData.class].chapters[questionData.subject]
      : []

  // Update exercises with safety check
  const exercises = (() => {
    try {
      if (questionData.unit && questionData.class && questionData.subject && classData) {
        const topicsData = classData[questionData.class]?.topics || {}

        // Special handling for Math subject
        if (questionData.subject === "Math" || questionData.subject === "Mathematics") {
          // Log for debugging
          console.log("Math subject detected, looking for topics in:", questionData.unit)
          console.log("Available topics:", topicsData[questionData.subject])

          // Try different ways to access the topics
          const mathTopics = topicsData[questionData.subject] || topicsData["Mathematics"] || topicsData["Math"] || {}

          return mathTopics[questionData.unit] || []
        }

        // Regular handling for other subjects
        const subjectTopics = topicsData[questionData.subject] || {}
        return subjectTopics[questionData.unit] || []
      }
      return []
    } catch (error) {
      console.error("Error accessing exercises:", error)
      return []
    }
  })()

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options]
    newOptions[index] = value
    setQuestionData((prev) => ({ ...prev, options: newOptions }))
  }

  // Add the handlePartChange function
  const handlePartChange = (index, value) => {
    const newParts = [...questionData.parts]
    newParts[index] = value
    setQuestionData((prev) => ({ ...prev, parts: newParts }))
  }

  // Add a function to add a new part
  const addPart = () => {
    setQuestionData((prev) => ({
      ...prev,
      parts: [...prev.parts, ""],
    }))
  }

  // Add a function to remove a part
  const removePart = (index) => {
    if (questionData.parts.length <= 2) {
      toast.error("A long question must have at least 2 parts")
      return
    }

    const newParts = [...questionData.parts]
    newParts.splice(index, 1)

    // If the removed part was selected as the answer, reset selectedPart
    if (Number(questionData.selectedPart) === index) {
      setQuestionData((prev) => ({
        ...prev,
        parts: newParts,
        selectedPart: "",
      }))
    } else if (Number(questionData.selectedPart) > index) {
      // If the selected part was after the removed part, adjust its index
      setQuestionData((prev) => ({
        ...prev,
        parts: newParts,
        selectedPart: String(Number(prev.selectedPart) - 1),
      }))
    } else {
      setQuestionData((prev) => ({
        ...prev,
        parts: newParts,
      }))
    }
  }

  // Toggle the use of parts for long questions
  const toggleUseParts = () => {
    setQuestionData((prev) => ({
      ...prev,
      useParts: !prev.useParts,
    }))
  }

  // Update handleImageUpload to safely handle images array
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Validate files
    const validFiles = files.filter((file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024)

    if (validFiles.length !== files.length) {
      toast.error("Please upload only image files (max 5MB each)")
      return
    }

    // Create preview URLs
    const imageUrls = await Promise.all(validFiles.map((file) => URL.createObjectURL(file)))

    setQuestionData((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...imageUrls], // Safe array spread
      imageFiles: [...(prev.imageFiles || []), ...validFiles], // Safe array spread
    }))
  }

  // Update removeImage to safely handle arrays
  const removeImage = (index) => {
    setQuestionData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
      imageFiles: (prev.imageFiles || []).filter((_, i) => i !== index),
    }))
  }

  // ... existing code ...

  // Update the handleSubmit function to handle parts for long questions
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!questionData.text || !questionData.unit || !questionData.exercise) {
      toast.error("Please fill all required fields")
      return
    }

    if (questionData.type === "mcqs") {
      if (questionData.options.some((opt) => !opt)) {
        toast.error("Please fill all options for MCQs")
        return
      }
      if (!questionData.correctOption) {
        toast.error("Please select the correct answer")
        return
      }
    }

    // Add validation for long questions with parts only if useParts is true
    if ((questionData.type === "long" || questionData.type.includes("long")) && questionData.useParts) {
      if (questionData.parts.some((part) => !part)) {
        toast.error("Please fill all parts for the long question")
        return
      }
      if (!questionData.selectedPart) {
        toast.error("Please select the correct part")
        return
      }
    }

    try {
      const newQuestion = {
        id: String(Date.now()),
        // type: questionData.type + (questionData.useParts ? "_with_parts" : ""),
        type: questionData.type,
        chapter: questionData.unit,
        topic: questionData.exercise,
        marks: Number.parseInt(questionData.marks),
        text: questionData.text,
        options: questionData.type === "mcqs" ? questionData.options : null,
        // Handle parts for long questions only if useParts is true
        parts: questionData.type === "long" && questionData.useParts ? questionData.parts : null,
        answer:
          questionData.type === "mcqs"
            ? questionData.options[Number.parseInt(questionData.correctOption)]
            : questionData.type === "long" && questionData.useParts
              ? questionData.parts[Number.parseInt(questionData.selectedPart)]
              : null,
        source: questionData.source,
        medium: questionData.medium,
        class: questionData.class,
        subject: questionData.subject,
        statement: questionData.statement,
        // ... existing fields ...
        images: questionData.images, // Add images to the payload
      }

      console.log("Sending question data:", JSON.stringify({ question: newQuestion }))

      // Use external PHP API endpoint instead of Next.js API route
      const apiUrl = "https://edu.largifysolutions.com/api-questions.php"
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ question: newQuestion }),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error:", errorText)
        throw new Error(`Failed to add question: ${errorText}`)
      }

      const data = await response.json()
      console.log("API Response:", data)

      if (!data.success) {
        throw new Error(data.error || "Failed to add question")
      }

      toast.success("Question added successfully!", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#4ade80",
          color: "#fff",
          padding: "16px",
        },
      })

      // Reset form
      setQuestionData({
        text: "",
        type: "mcqs",
        subject: questionData.subject, // Keep these values for convenience
        class: questionData.class,
        unit: questionData.unit,
        exercise: questionData.exercise,
        marks: "1",
        options: ["", "", "", ""],
        correctOption: "",
        source: "exercise",
        medium: questionData.medium, // Keep medium
        statement: "Choose the correct option",
        parts: ["", ""], // Reset parts
        selectedPart: "", // Reset selected part
        useParts: false, // Reset useParts flag
      })
    } catch (error) {
      console.error("Error adding question:", error)
      toast.error(error.message || "Failed to add question")
    }
  }

  // Ensure consistent class names across server and client
  const getStepHeadingClass = (color1, color2) => {
    return `text-2xl font-bold bg-gradient-to-r from-${color1} to-${color2} bg-clip-text text-transparent pb-2 border-b-2 border-${color1}-100 inline-block`
  }

  // Add this class combining function
  const combineClasses = (...classes) => {
    return classes.filter(Boolean).join(" ")
  }

  // Function to insert math at cursor position
  const insertMathAtCursor = (mathLatex) => {
    if (questionTextRef && questionTextRef.selectionStart !== undefined) {
      const start = questionTextRef.selectionStart
      const end = questionTextRef.selectionEnd
      const currentText = questionData.text
      const newText = currentText.slice(0, start) + mathLatex + currentText.slice(end)
      
      setQuestionData(prev => ({ ...prev, text: newText }))
      
      // Set cursor position after inserted text
      setTimeout(() => {
        if (questionTextRef) {
          questionTextRef.selectionStart = questionTextRef.selectionEnd = start + mathLatex.length
          questionTextRef.focus()
        }
      }, 0)
    } else {
      // Fallback: just append to the end of the text
      setQuestionData(prev => ({ ...prev, text: prev.text + mathLatex }))
    }
  }

  // Add this utility function near the top of your component
  // Update the shouldUseUrduFont function to be more comprehensive
  const shouldUseUrduFont = (subject) => {
    const urduSubjects = [
      "Urdu",
      "Quran",
      "Islamiat",
      "Tarjuma Quran",
      "Islamyat",
      "Pakistan Studies",
      "Pak Studies",
      "ترجمہ قرآن",
    ]
    return urduSubjects.includes(subject)
  }

  // Update the getTextStyle function to provide better Urdu font support
  const getTextStyle = (medium) => {
    return medium === "URDU MEDIUM"
      ? {
          fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', 'Urdu Typesetting', serif",
          direction: "rtl",
          fontSize: "1.2rem",
          lineHeight: "2rem",
        }
      : {}
  }

  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.replace("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  // Add the renderQuestionTypeFields function
  const renderQuestionTypeFields = () => {
    if (questionData.type === "mcqs") {
      return (
        <div className="space-y-4">
          <label
            className={combineClasses(
              "block text-sm font-medium text-gray-700",
              shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right" : "",
            )}
          >
            {shouldUseUrduFont(questionData.subject) ? "آپشنز" : "Options"}
          </label>
          {["A", "B", "C", "D"].map((optionLabel, index) => (
                            <div key={optionLabel} className="space-y-2">
                              <label className={combineClasses(
                                "block text-sm font-medium text-gray-700",
                                shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right" : "",
                              )}>
                                {shouldUseUrduFont(questionData.subject) ? `آپشن ${optionLabel}` : `Option ${optionLabel}`} *
                              </label>
                              <div className="flex items-start gap-4">
                                <textarea
                                  value={questionData.options[index] || ""}
                                  onChange={(e) => {
                                    if (questionData.subject === 'Mathematics' || questionData.subject === 'Math') {
                                      handleTextInput(e, (value) => handleOptionChange(index, value));
                                    } else {
                                      handleOptionChange(index, e.target.value);
                                    }
                                  }}
                                  className={combineClasses(
                                    "flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500",
                                    questionData.medium === "URDU MEDIUM" ? "font-nastaliq text-right" : "",
                                  )}
                                  style={{
                                    ...getTextStyle(questionData.medium),
                                    whiteSpace: "pre-wrap",
                                  }}
                                  rows="2"
                                  placeholder={shouldUseUrduFont(questionData.subject) 
                                    ? `آپشن ${optionLabel} درج کریں` 
                                    : questionData.subject === 'Mathematics' || questionData.subject === 'Math'
                                      ? `Enter option ${optionLabel} (type 'x square' for x²)...`
                                      : `Enter option ${optionLabel}...`
                                  }
                                  required
                                />
                                <input
                                  type="radio"
                                  name="correctOption"
                                  value={index}
                                  checked={questionData.correctOption === String(index)}
                                  onChange={(e) =>
                                    setQuestionData((prev) => ({
                                      ...prev,
                                      correctOption: e.target.value,
                                    }))
                                  }
                                  className="w-4 h-4 text-blue-600 mt-2"
                                />
                              </div>
                              {/* Option Preview */}
                              {questionData.options[index] && (
                                <div className="p-2 bg-gray-50 border border-gray-200 rounded text-sm">
                                  <span className="font-medium text-gray-600">
                                    {shouldUseUrduFont(questionData.subject) ? "پیش منظر: " : "Preview: "}
                                  </span>
                                  <span className="text-gray-800">
                                    {questionData.subject === 'Mathematics' ? renderMathText(questionData.options[index]) : questionData.options[index]}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
        </div>
      )
    } else if (questionData.type === "long" || questionData.type.includes("long")) {
      return (
        <div className="space-y-4">
          {/* Add toggle for using parts */}
          <div className="flex items-center justify-between">
            <label
              className={combineClasses(
                "block text-sm font-medium text-gray-700",
                shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right" : "",
              )}
            >
              {shouldUseUrduFont(questionData.subject) ? "حصوں کے ساتھ سوال" : "Question with Parts"}
            </label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
              <input
                type="checkbox"
                id="toggle-parts"
                className="absolute w-0 h-0 opacity-0"
                checked={questionData.useParts}
                onChange={toggleUseParts}
              />
              <label
                htmlFor="toggle-parts"
                className={`block h-6 overflow-hidden rounded-full cursor-pointer transition-colors duration-300 ${
                  questionData.useParts ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-300 ${
                    questionData.useParts ? "translate-x-6" : "translate-x-0"
                  }`}
                ></span>
              </label>
            </div>
          </div>

          {questionData.useParts ? (
            <>
              <div className="flex items-center justify-between">
                <label
                  className={combineClasses(
                    "block text-sm font-medium text-gray-700",
                    shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right" : "",
                  )}
                >
                  {shouldUseUrduFont(questionData.subject) ? "حصے" : "Parts"}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={addPart}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    {shouldUseUrduFont(questionData.subject) ? "حصہ شامل کریں" : "Add Part"}
                  </button>
                </div>
              </div>
              {questionData.parts.map((part, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <textarea
                    value={part}
                    onChange={(e) => handlePartChange(index, e.target.value)}
                    className={combineClasses(
                      "flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500",
                      questionData.medium === "URDU MEDIUM" ? "font-nastaliq text-right" : "",
                    )}
                    style={{
                      ...getTextStyle(questionData.medium),
                      whiteSpace: "pre-wrap",
                    }}
                    placeholder={
                      shouldUseUrduFont(questionData.subject)
                        ? `حصہ ${index === 0 ? "الف" : index === 1 ? "ب" : index === 2 ? "ج" : "د"}`
                        : `Part ${String.fromCharCode(65 + index)}`
                    }
                    rows={4}
                  />
                  <div className="flex flex-col gap-2">
                    <input
                      type="radio"
                      name="selectedPart"
                      value={index}
                      checked={questionData.selectedPart === String(index)}
                      onChange={(e) =>
                        setQuestionData((prev) => ({
                          ...prev,
                          selectedPart: e.target.value,
                        }))
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    {questionData.parts.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removePart(index)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : null}
        </div>
      )
    }
    return null
  }

  return (
    <ProtectedRoute>
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 ${nastaliq.variable}`}>
        <Toaster position="top-center" />
        <div className="container mx-auto px-4 py-8">
          {/* Keep the enhanced header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
              Add New Question
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm">
              <Link href="/" className="text-blue-600 hover:text-purple-600 transition-colors duration-300">
                Home
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-500">Add Question</span>
            </div>
          </div>

          {/* Enhanced Form Container */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Class Selection */}
                <div className="space-y-6">
                  <h2 className={getStepHeadingClass("blue-600", "indigo-600")}>Step 1: Select Class</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {classes.map((className) => (
                      <motion.div
                        key={className}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl cursor-pointer text-center transition-all duration-300 ${
                          questionData.class === className
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500 shadow-md"
                            : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-blue-200"
                        }`}
                        onClick={() => {
                          setQuestionData((prev) => ({
                            ...prev,
                            class: className,
                            subject: "",
                            unit: "",
                            exercise: "",
                          }))
                          setSelectedUnit(null)
                          setSelectedExercise(null)
                        }}
                      >
                        <h3 className="font-medium text-gray-800">{className}</h3>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Subject Selection */}
                {questionData.class && (
                  <div className="space-y-6">
                    <h2 className={getStepHeadingClass("cyan-600", "teal-600")}>Step 2: Select Subject</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subjects.map((subject) => (
                        <motion.div
                          key={subject}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                            questionData.subject === subject
                              ? "bg-gradient-to-r from-cyan-50 to-teal-50 border-2 border-cyan-500 shadow-md"
                              : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-cyan-200"
                          }`}
                          onClick={() => {
                            setQuestionData((prev) => ({
                              ...prev,
                              subject: subject,
                              unit: "",
                              exercise: "",
                              medium: shouldUseUrduFont(subject) ? "URDU MEDIUM" : "ENGLISH MEDIUM",
                            }))
                            setSelectedUnit(null)
                            setSelectedExercise(null)
                          }}
                        >
                          <h3 className="font-medium text-gray-800">{subject}</h3>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Unit Selection */}
                {questionData.subject && (
                  <div className="space-y-6">
                    <h2 className={getStepHeadingClass("indigo-600", "violet-600")}>Step 3: Select Unit</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {units.map((unit, index) => (
                        <motion.div
                          key={index}
                          className={`p-4 rounded-xl cursor-pointer transition-all ${
                            questionData.unit === unit
                              ? "bg-indigo-50 border-2 border-indigo-500"
                              : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                          }`}
                          onClick={() => {
                            setQuestionData((prev) => ({
                              ...prev,
                              unit: unit,
                              exercise: "",
                            }))
                            setSelectedUnit(index)
                            setSelectedExercise(null)
                          }}
                        >
                          <h3
                            className={combineClasses(
                              "font-medium text-gray-800",
                              shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right text-2xl" : "",
                            )}
                          >
                            {unit}
                          </h3>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exercise Selection */}
                {questionData.unit && (
                  <div className="space-y-6">
                    <h2 className={getStepHeadingClass("violet-600", "purple-600")}>Step 4: Select Exercise</h2>
                    <div className="grid grid-cols-1 gap-4">
                      {exercises.map((exercise, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                            questionData.exercise === exercise
                              ? "bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-500 shadow-md"
                              : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-violet-200"
                          }`}
                          onClick={() => {
                            setQuestionData((prev) => ({
                              ...prev,
                              exercise: exercise,
                            }))
                            setSelectedExercise(index)
                          }}
                        >
                          <h3
                            className={combineClasses(
                              "font-medium text-gray-800",
                              shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right text-2xl" : "",
                            )}
                          >
                            {exercise}
                          </h3>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Question Type and Details Section */}
                {questionData.exercise && (
                  <>
                    {/* Question Type Selection */}
                    <div className="space-y-6">
                      <h2
                        className={combineClasses(
                          "text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent",
                          shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right" : "",
                        )}
                      >
                        {shouldUseUrduFont(questionData.subject) ? "سوال کی قسم" : "Question Type"}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(() => {
                          // Define question types for each class
                          const questionTypes = {
                            "9th": [
                              {
                                type: "mcqs",
                                marks: 1,
                                statement: "Choose the correct option",
                              },
                              {
                                type: "short",
                                marks: 2,
                                statement: "Write short answers to the following questions.",
                              },
                              {
                                type: "e_to_u",
                                marks: 8,
                                statement: "Translate the following paragraph into urdu",
                              },
                              {
                                type: "summary",
                                marks: 5,
                                statement: "Write a summary of the poem",
                              },
                              {
                                type: "w_sentence",
                                marks: 1,
                                statement: "Use following words/phrases/idioms in your own sentences.",
                              },
                              {
                                type: "letter",
                                marks: 8,
                                statement: "Write a letter to",
                              },
                              {
                                type: "story",
                                marks: 8,
                                statement: "Write a story with the title",
                              },
                              {
                                type: "dialogue",
                                marks: 8,
                                statement: "Write a dialogue between",
                              },
                              {
                                type: "comprehense",
                                marks: 10,
                                statement: "Read the passage carefully and answer the questions given at the end.",
                              },
                              {
                                type: "u_to_e",
                                marks: 1,
                                statement: "Translate the following sentences into English.",
                              },
                              {
                                type: "act_pass",
                                marks: 1,
                                statement: "Change the voice of the following sentences.",
                              },
                            ],
                            "10th": [
                              {
                                type: "mcqs",
                                marks: 1,
                                statement: "Choose the correct option",
                              },
                              {
                                type: "short",
                                marks: 2,
                                statement: "Write short answers to the following questions.",
                              },
                              {
                                type: "e_to_u",
                                marks: 8,
                                statement: "Translate the following paragraph into urdu",
                              },
                              {
                                type: "summary",
                                marks: 5,
                                statement: "Write a summary of the poem",
                              },
                              {
                                type: "essay",
                                marks: 15,
                                statement: "Write an essay on any one of the following topics.",
                              },
                              {
                                type: "dir_ind",
                                marks: 1,
                                statement: "Change the following sentences into indirect form.",
                              },
                              {
                                type: "pair_o_w",
                                marks: 1,
                                statement: "Use the following pair of words in your own sentences.",
                              },
                              {
                                type: "u_to_e",
                                marks: 8,
                                statement: "Translate the following paragraph into English.",
                              },
                            ],
                            "11th": [
                              {
                                type: "mcqs",
                                marks: 1,
                                statement: "Choose the correct option",
                              },
                              {
                                type: "sq_book_i",
                                marks: 2,
                                statement: "Write short answers to the following questions (From Book I)",
                              },
                              {
                                type: "sqBoPlays",
                                marks: 2,
                                statement: "Write short answers to the following questions (From Book III Plays)",
                              },
                              {
                                type: "sqBokPoems",
                                marks: 2,
                                statement: "Write short answers to the following questions (From Book III Poems)",
                              },
                              {
                                type: "letter",
                                marks: 10,
                                statement: "Write a letter to",
                              },
                              {
                                type: "application",
                                marks: 10,
                                statement: "Write an application to",
                              },
                              {
                                type: "story",
                                marks: 10,
                                statement: "Write a story being a moral lesson",
                              },
                              {
                                type: "exp_poems",
                                marks: 5,
                                statement: "Translate the following lines with reference to the context.",
                              },
                              {
                                type: "punctuation",
                                marks: 5,
                                statement: "Punctuate the following extract",
                              },
                              {
                                type: "pair_o_w",
                                marks: 1,
                                statement: "Use following pair of words in your own sentences.",
                              },
                              {
                                type: "e_to_u",
                                marks: 15,
                                statement: "Translate the following passage into urdu.",
                              },
                            ],
                            "12th": [
                              {
                                type: "mcqs",
                                marks: 1,
                                statement: "Choose the correct option",
                              },
                              {
                                type: "sq_ii_pr_i",
                                marks: 2,
                                statement:
                                  "Write short answers to the following questions (Book II Modern Prose & Heroes Part-I)",
                              },
                              {
                                type: "sq_ii_pr_i",
                                marks: 2,
                                statement:
                                  "Write short answers to the following questions (Book II Modern Prose & Heroes Part-II)",
                              },
                              {
                                type: "mr_chips",
                                marks: 2,
                                statement: "Write short answers to the following questions (Mr. Chips)",
                              },
                              {
                                type: "e_to_u",
                                marks: 15,
                                statement: "Translate the following paragraph into Urdu.",
                              },
                              {
                                type: "essay",
                                marks: 15,
                                statement: "Write an essay on any one of the following topics.",
                              },
                              {
                                type: "idioms",
                                marks: 2,
                                statement: "Use the following Idioms/Phrasal verbs in your own sentences.",
                              },
                              {
                                type: "u_to_e",
                                marks: 15,
                                statement: "Translate the following paragraph into English.",
                              },
                            ],
                          }

                          // Define English-specific question types for each class
                          const englishQuestionTypesUpdated = {
                            "9th": [
                              {
                                type: "mcqs",
                                marks: 1,
                                statement: "Choose the correct option",
                              },
                              {
                                type: "short",
                                marks: 2,
                                statement: "Write short answers to the following questions.",
                              },
                              {
                                type: "e_to_u",
                                marks: 8,
                                statement: "Translate the following paragraph into urdu",
                              },
                              {
                                type: "summary",
                                marks: 5,
                                statement: "Write a summery of the poem",
                              },
                              {
                                type: "w_sentence",
                                marks: 1,
                                statement: "Use following words/phrases/idioms in your own sentences.",
                              },
                              {
                                type: "letter",
                                marks: 8,
                                statement: "Write a letter to",
                              },
                              {
                                type: "story",
                                marks: 8,
                                statement: "Write a story with the title",
                              },
                              {
                                type: "dialogue",
                                marks: 8,
                                statement: "Write a dialogue between",
                              },
                              {
                                type: "comprehense",
                                marks: 10,
                                statement: "Read the passage carefully and answer the questions given at the end.",
                              },
                              {
                                type: "u_to_e",
                                marks: 1,
                                statement: "Translate the following sentences into English.",
                              },
                              {
                                type: "act_pass",
                                marks: 1,
                                statement: "Change the voice of the following sentences.",
                              },
                            ],
                            "10th": [
                              {
                                type: "mcqs",
                                marks: 1,
                                statement: "Choose the correct option",
                              },
                              {
                                type: "short",
                                marks: 2,
                                statement: "Write short answers to the following questions.",
                              },
                              {
                                type: "e_to_u",
                                marks: 8,
                                statement: "Translate the following paragraph into urdu",
                              },
                              {
                                type: "summary",
                                marks: 5,
                                statement: "Write a summary of the poem",
                              },
                              {
                                type: "essay",
                                marks: 15,
                                statement: "Write an essay on any one of the following topics.",
                              },
                              {
                                type: "dir_ind",
                                marks: 1,
                                statement: "Change the following sentences into indirect form.",
                              },
                              {
                                type: "pair_o_w",
                                marks: 1,
                                statement: "Use the following pair of words in your own sentences.",
                              },
                              {
                                type: "u_to_e",
                                marks: 8,
                                statement: "Translate the following paragraph into English.",
                              },
                            ],
                            "11th": [
                              {
                                type: "mcqs",
                                marks: 1,
                                statement: "Choose the correct option",
                              },
                              {
                                type: "sq_book_i",
                                marks: 2,
                                statement: "Write short answers to the following questions (From Book I)",
                              },
                              {
                                type: "sqBoPlays",
                                marks: 2,
                                statement: "Write short answers to the following questions (From Book III Plays)",
                              },
                              {
                                type: "sqBokPoems",
                                marks: 2,
                                statement: "Write short answers to the following questions (From Book III Poems)",
                              },
                              {
                                type: "letter",
                                marks: 10,
                                statement: "Write a letter to",
                              },
                              {
                                type: "application",
                                marks: 10,
                                statement: "Write an application to",
                              },
                              {
                                type: "story",
                                marks: 10,
                                statement: "Write a story being a moral lesson",
                              },
                              {
                                type: "exp_poems",
                                marks: 5,
                                statement: "Translate the following lines with reference to the context.",
                              },
                              {
                                type: "punctuation",
                                marks: 5,
                                statement: "Punctuate the following extract",
                              },
                              {
                                type: "pair_o_w",
                                marks: 1,
                                statement: "Use following pair of words in your own sentences.",
                              },
                              {
                                type: "e_to_u",
                                marks: 15,
                                statement: "Translate the following passage into urdu.",
                              },
                            ],
                            "12th": [
                              {
                                type: "mcqs",
                                marks: 1,
                                statement: "Choose the correct option",
                              },
                              {
                                type: "sq_ii_pr_i",
                                marks: 2,
                                statement:
                                  "Write short answers to the following questions (Book II Modern Prose & Heroes Part-I)",
                              },
                              {
                                type: "sq_ii_pr_i",
                                marks: 2,
                                statement:
                                  "Write short answers to the following questions (Book II Modern Prose & Heroes Part-II)",
                              },
                              {
                                type: "mr_chips",
                                marks: 2,
                                statement: "Write short answers to the following questions (Mr. Chips)",
                              },
                              {
                                type: "e_to_u",
                                marks: 15,
                                statement: "Translate the following paragraph into Urdu.",
                              },
                              {
                                type: "essay",
                                marks: 15,
                                statement: "Write an essay on any one of the following topics.",
                              },
                              {
                                type: "idioms",
                                marks: 2,
                                statement: "Use the following Idioms/Phrasal verbs in your own sentences.",
                              },
                              {
                                type: "u_to_e",
                                marks: 15,
                                statement: "Translate the following paragraph into English.",
                              },
                            ],
                          }

                          // Define Pakistan Studies question types
                          const pakStudiesQuestionTypes = [
                            {
                              type: "mcqs",
                              marks: 1,
                              statement: "درست جواب کا انتخاب کریں۔",
                              urduLabel: "ایم سی کیوز",
                            },
                            {
                              type: "short",
                              marks: 2,
                              statement: "درج ذیل سوالات کے مختصر جوابات دیں۔",
                              urduLabel: "مختصر سوالات",
                            },
                            {
                              type: "long",
                              marks: 8,
                              statement: "درج ذیل سوالوں کے تفصیلی جوابات دیں۔",
                              urduLabel: "تفصیلی سوالات",
                            },
                          ]

                          // Define Tarjuma Quran question types
                          const tarjumaQuranQuestionTypes = [
                            {
                              type: "mcqs",
                              marks: 1,
                              statement: "درست جواب کا انتخاب کریں۔",
                              urduLabel: "ایم سی کیوز",
                            },
                            {
                              type: "short",
                              marks: 2,
                              statement: "درج ذیل سوالات کے مختصر جوابات دیں۔",
                              urduLabel: "مختصر سوالات",
                            },
                            {
                              type: "q_w_m",
                              marks: 1,
                              statement: "درج ذیل قرآنی الفاظ کے معنٰی لکھیں۔",
                              urduLabel: "الفاظ معنی",
                            },
                            {
                              type: "ayat",
                              marks: 5,
                              statement: "درج ذیل آیات کا با محاورہ ترجمہ لکھیں۔",
                              urduLabel: "آیات کا ترجمہ",
                            },
                            {
                              type: "note",
                              marks: 10,
                              statement: "درج ذیل موضوع پر تفصیلی نوٹ لکھیں۔",
                              urduLabel: " نوٹ",
                            },
                            // {
                            //   type: "long",
                            //   marks: 8,
                            //   statement: "درج ذیل سوالوں کے تفصیلی جوابات دیں۔",
                            //   urduLabel: "تفصیلی سوالات",
                            // },
                            // {
                            //   type: "translation",
                            //   marks: 5,
                            //   statement: "درج ذیل آیات کا ترجمہ کریں۔",
                            //   urduLabel: "ترجمہ",
                            // },
                            // {
                            //   type: "tafseer",
                            //   marks: 10,
                            //   statement: "درج ذیل آیات کی تفسیر لکھیں۔",
                            //   urduLabel: "تفسیر",
                            // },
                          ]

                          // Define Islamiyat question types
                          const islamiyatQuestionTypes = [
                            {
                              type: "mcqs",
                              marks: 1,
                              statement: "درست جواب کا انتخاب کریں۔",
                              urduLabel: "ایم سی کیوز",
                            },
                            {
                              type: "short",
                              marks: 2,
                              statement: "درج ذیل سوالات کے مختصر جوابات دیں۔",
                              urduLabel: "مختصر سوالات",
                            },
                            {
                              type: "long",
                              marks: 4,
                              statement: "درج ذیل سوالوں کے تفصیلی جوابات دیں۔",
                              urduLabel: "تفصیلی سوالات",
                            },
                            {
                              type: "hadith",
                              marks: 3,
                              statement: "درج ذیل حدیث مبارکہ کا ترجمہ تحریر کیجیے",
                              urduLabel: "حدیث کا ترجمہ",
                            },
                            {
                              type: "note",
                              marks: 5,
                              statement: "درج ذیل عنوان پ�� تفصیلی نوٹ لکھیں۔",
                              urduLabel: "نوٹ",
                            },
                            {
                              type: "ayat",
                              marks: 5,
                              statement: "درج ذیل آیات کا ترجمہ تحریر کیجیے",
                              urduLabel: "آیات",
                            },
                          ]

                          // Define Urdu question types for 9th class
                          const urdu9thQuestionTypes = [
                            {
                              type: "mcqs",
                              marks: 1,
                              statement: "درست جواب کا انتخاب کریں۔",
                              urduLabel: "ایم سی کیوز",
                            },
                            {
                              type: "poet_ex",
                              marks: 2,
                              statement: "مندرجہ ذیل نظم و غزل کے اشعار کی تشریح کیجیے",
                              urduLabel: "اشعار کی تشریح",
                            },
                            {
                              type: "proseExp",
                              marks: 5,
                              statement:
                                "درج ذیل نثر پاروں کی تشریح کیجیے۔سبق کاعنوان، مصنف کا نام اور خط کشیدہ الفاظ کے معنی بھی تحریر کیجیے۔",
                              urduLabel: "نثر پاروں کی تشریح",
                            },
                            {
                              type: "short",
                              marks: 2,
                              statement: "درج ذیل سوالوں کے مختصر جوابات دیں۔",
                              urduLabel: "مختصر سوالات",
                            },
                            {
                              type: "summary",
                              marks: 5,
                              statement: "درج ذیل سبق کا خلاصہ لکھیے۔",
                              urduLabel: "خلاصہ",
                            },
                            {
                              type: "cen_idea",
                              marks: 5,
                              statement: '"ــــ" نظم کا مرکزی خیال یا خلاصہ لکھیں اور شاعر کا نام بھی تحریر کریں۔',
                              urduLabel: "مرکزی خیال حصہ نظم",
                            },
                            {
                              type: "letter",
                              marks: 10,
                              statement: "خط لکھیے",
                              urduLabel: "خط",
                            },
                            {
                              type: "application",
                              marks: 10,
                              statement: "درخواست لکھیے",
                              urduLabel: "درخواست",
                            },
                            {
                              type: "story",
                              marks: 5,
                              statement: '"----" کے عنوان پر ایک کہانی تحریر کیجیے۔',
                              urduLabel: "کہانی",
                            },
                            {
                              type: "dialogue",
                              marks: 5,
                              statement: '"----" کی درمیان ہونے والا مکالمہ تحریر کیجیے۔',
                              urduLabel: "مکالمہ",
                            },
                            {
                              type: "sen_corr",
                              marks: 5,
                              statement: "درج ذیل جملوں کی درستی کیجیے۔",
                              urduLabel: "جملوں کی درستی",
                            },
                            {
                              type: "provrb_exp",
                              marks: 5,
                              statement: "درج ذیل ضرب الامثال کی درستی کیجیے۔",
                              urduLabel: "ضرب الامثال",
                            },
                          ]

                          // Define Urdu question types for 10th class
                          const urdu10thQuestionTypes = [
                            {
                              type: "mcqs",
                              marks: 1,
                              statement: "درست جواب کا انتخاب کریں۔",
                              urduLabel: "ایم سی کیوز",
                            },
                            {
                              type: "poet_ex",
                              marks: 2,
                              statement: "مندرجہ ذیل نظم و غزل کے اشعار کی تشریح کیجیے",
                              urduLabel: "اشعار کی تشریح",
                            },
                            {
                              type: "provrb_exp",
                              marks: 5,
                              statement:
                                "درج ذیل نثر پاروں کی تشریح کیجیے۔سبق کاعنوان، مصنف کا نام اور خط کشیدہ الفاظ کے معنی بھی تحریر کیجیے۔",
                              urduLabel: "نثر پاروں کی تشریح",
                            },
                            {
                              type: "short",
                              marks: 2,
                              statement: "درج ذیل سوالوں کے مختصر جوابات دیں۔",
                              urduLabel: "مختصر سوالات",
                            },
                            {
                              type: "summary",
                              marks: 5,
                              statement: "درج ذیل سبق کا خلاصہ لکھیے۔",
                              urduLabel: "خلاصہ",
                            },
                            {
                              type: "essay",
                              marks: 15,
                              statement: "درج ذیل عنوان پر مضمون لکھیں۔",
                              urduLabel: "مضمون",
                            },
                            {
                              type: "comprehense",
                              marks: 10,
                              statement: "درج ذیل عبارت کو غور سے پڑھیے اور آخر میں دیے گئے سوالات کے جوابات لکھیے۔",
                              urduLabel: "تفہیم عبارت",
                            },
                          ]

                          // Define Urdu question types for 11th class
                          const urdu11thQuestionTypes = [
                            {
                              type: "mcqs",
                              marks: 1,
                              statement: "درست جواب کا انتخاب کریں۔",
                              urduLabel: "ایم سی کیوز",
                            },
                            {
                              type: "poet_ex",
                              marks: 4,
                              statement:
                                "مندرجہ ذیل نظم کے اشعار کی تشریح کیجیے۔ شاعر کا نام اور نظم کا عنوان بھی لکھیں۔",
                              urduLabel: "اشعار کی تشریح حصہ نظم",
                            },
                            {
                              type: "ghazl_ex",
                              marks: 3,
                              statement: "مندرجہ ذیل غزل کے اشعار کی تشریح کیجیے۔شاعر کا نام بھی تحریر کیجیے۔",
                              urduLabel: "اشعار کی تشریح حصہ غزل",
                            },
                            {
                              type: "proseExp",
                              marks: 10,
                              statement:
                                "سیاق و سباق کے حوالے سے درج ذیل نثر پاروں کی تشریح کیجیے۔سبق کاعنوان، مصنف کا نام اور سیاق وسباق بھی تحریر کیجیے۔",
                              urduLabel: "نثر پاروں کی تشریح",
                            },
                            {
                              type: "poem_summ",
                              marks: 5,
                              statement: "درج ذیل نظم کا خلاصہ تحریر کیجیے۔",
                              urduLabel: "نظم کا خلاصہ",
                            },
                            {
                              type: "lessonSumm",
                              marks: 10,
                              statement: "درج ذیل سبق کا خلاصہ لکھیے اور مصنف کا نام بھی تحریر کیجیے۔",
                              urduLabel: "سبق کا خلاصہ",
                            },
                            {
                              type: "dialogue",
                              marks: 10,
                              statement: "'----' کے درمیان مکالمہ تحریر کیجیے۔",
                              urduLabel: "مکالمہ",
                            },
                            {
                              type: "report",
                              marks: 10,
                              statement: "روداد تحریر کیجیے۔",
                              urduLabel: "روداد",
                            },
                            {
                              type: "receipt",
                              marks: 10,
                              statement: "رسید تحریر کیجیے۔",
                              urduLabel: "رسید",
                            },
                            {
                              type: "application",
                              marks: 10,
                              statement: "درخواست تحریر کیجیے۔",
                              urduLabel: "درخواست",
                            },
                            {
                              type: "precis",
                              marks: 10,
                              statement: "درج یل عبارت کی تلخیص کیجیے اور اس کا مناسب عنوان بھی تجویز کیجیے۔",
                              urduLabel: "تلخیص",
                            },
                          ]

                          // Define Urdu question types for 12th class
                          const urdu12thQuestionTypes = [
                            {
                              type: "mcqs",
                              marks: 1,
                              statement: "درست جواب کا انتخاب کریں۔",
                              urduLabel: "ایم سی کیوز",
                            },
                            {
                              type: "poet_ex",
                              marks: 4,
                              statement:
                                "مندرجہ ذیل نظم کے اشعار کی تشریح کیجیے۔نطم کا عنوان اور شاعر کا نام بھی تحریر کیجیے۔",
                              urduLabel: "اشعار کی تشریح حصہ نطم",
                            },
                            {
                              type: "ghazl_ex",
                              marks: 3,
                              statement: "مندرجہ ذیل غزل کے اشعار کی تشریح کیجیے۔ شاعر کا نام بھی لکھیے۔",
                              urduLabel: "اشعار کی تشریح حصہ غزل",
                            },
                            {
                              type: "proseExp",
                              marks: 10,
                              statement:
                                "درج ذیل نثر پاروں کی تشریح کیجیے۔سبق کاعنوان، مصنف کا نام اور سیاق و سباق بھی تحریر کیجیے۔",
                              urduLabel: "نثر پاروں کی تشریح",
                            },
                            {
                              type: "poem_summ",
                              marks: 5,
                              statement: "درج ذیل نظم کا خلاصہ تحریر کیجیے۔اور مصنف کا نام بھی تحریر کیجیے۔",
                              urduLabel: "نظم کا خلاصہ",
                            },
                            {
                              type: "lessonSumm",
                              marks: 10,
                              statement: "درج ذیل سبق کا خلاصہ لکھیے اور مصنف کا نام بھی تحریر کیجیے۔",
                              urduLabel: "سبق کا خلاصہ",
                            },
                            {
                              type: "essay",
                              marks: 20,
                              statement: "درج ذیل عنوان پر مضمون تحریر کیجیے۔",
                              urduLabel: "مضمون",
                            },
                            {
                              type: "letter",
                              marks: 10,
                              statement: "خط تحریر کیجیے۔",
                              urduLabel: "خط",
                            },
                          ]

                          // Define Science and Math question types for 9th and 10th classes
                          const scienceMath9th10thQuestionTypes = [
                            {
                              type: "mcqs",
                              marks: 1,
                              statement: "Choose the correct option",
                            },
                            {
                              type: "short",
                              marks: 2,
                              statement: "Attempt the following parts.",
                            },
                            {
                              type: "long",
                              marks: 8,
                              statement: "Attempt the following questions",
                            },
                          ]

                          // Define Computer Science question types for 9th and 10th classes
                          const computerScience9th10thQuestionTypes = [
                            {
                              type: "mcqs",
                              marks: 1,
                              statement: "Choose the correct option",
                            },
                            {
                              type: "short",
                              marks: 2,
                              statement: "Attempt the following parts.",
                            },
                            {
                              type: "long",
                              marks: 8,
                              statement: "Attempt the following questions",
                            },
                          ]

                          // Define Chemistry and Biology question types for 11th and 12th classes
                          const chemBio11th12thQuestionTypes = [
                            {
                              type: "mcqs",
                              marks: 1,
                              statement: "Choose the correct option",
                            },
                            {
                              type: "short",
                              marks: 2,
                              statement: "Attempt the following parts.",
                            },
                            {
                              type: "long",
                              marks: 4,
                              statement: "Attempt the following questions ",
                            },
                            // {
                            //   type: "long_part_b",
                            //   marks: 4,
                            //   statement: "Attempt the following questions (Part B)",
                            // },
                          ]

                          // Define Physics question types for 11th and 12th classes
                          const physics11th12thQuestionTypes = [
                            {
                              type: "mcqs",
                              marks: 1,
                              statement: "Choose the correct option",
                            },
                            {
                              type: "short",
                              marks: 2,
                              statement: "Attempt the following parts.",
                            },
                            {
                              type: "long",
                              marks: 8,
                              statement: "Attempt the following questions",
                            },
                          ]

                          // Define Math question types for 11th and 12th classes
                          const math11th12thQuestionTypes = [
                            {
                              type: "mcqs",
                              marks: 1,
                              statement: "Choose the correct option",
                            },
                            {
                              type: "short",
                              marks: 2,
                              statement: "Attempt the following parts.",
                            },
                            {
                              type: "long",
                              marks: 5,
                              statement: "Attempt the following questions ",
                            },
                            // {
                            //   type: "long_part_b",
                            //   marks: 5,
                            //   statement: "Attempt the following questions (Part B)",
                            // },
                          ]

                          // Define Computer Science question types for 11th and 12th classes
                          const computerScience11th12thQuestionTypes = [
                            {
                              type: "mcqs",
                              marks: 1,
                              statement: "Choose the correct option",
                            },
                            {
                              type: "short",
                              marks: 2,
                              statement: "Attempt the following parts.",
                            },
                            {
                              type: "long",
                              marks: 8,
                              statement: "Attempt the following questions",
                            },
                          ]

                          // Check subject type to determine which question types to show
                          let types = []

                          if (questionData.subject === "English") {
                            types = englishQuestionTypesUpdated[questionData.class] || []
                          } else if (questionData.subject === "Urdu") {
                            // Select Urdu question types based on class
                            if (questionData.class === "9th") {
                              types = urdu9thQuestionTypes
                            } else if (questionData.class === "10th") {
                              types = urdu10thQuestionTypes
                            } else if (questionData.class === "11th") {
                              types = urdu11thQuestionTypes
                            } else if (questionData.class === "12th") {
                              types = urdu12thQuestionTypes
                            }
                          } else if (
                            questionData.subject === "Pakistan Studies" ||
                            questionData.subject === "Pak Studies"
                          ) {
                            types = pakStudiesQuestionTypes
                          } else if (
                            questionData.subject === "Tarjuma Quran" ||
                            questionData.subject === "Quran" ||
                            questionData.subject === "ترجمہ قرآن"
                          ) {
                            types = tarjumaQuranQuestionTypes
                          } else if (questionData.subject === "Islamiat" || questionData.subject === "Islamyat") {
                            types = islamiyatQuestionTypes
                          } else if (
                            ["Physics", "Chemistry", "Biology", "Mathematics", "Math"].includes(questionData.subject)
                          ) {
                            // Science and Math subjects
                            if (["9th", "10th"].includes(questionData.class)) {
                              types = scienceMath9th10thQuestionTypes
                            } else if (["11th", "12th", "1st Year", "2nd Year"].includes(questionData.class)) {
                              if (["Chemistry", "Biology"].includes(questionData.subject)) {
                                types = chemBio11th12thQuestionTypes
                              } else if (questionData.subject === "Physics") {
                                types = physics11th12thQuestionTypes
                              } else if (["Mathematics", "Math"].includes(questionData.subject)) {
                                types = math11th12thQuestionTypes
                              }
                            }
                          } else if (["Computer", "Computer Science"].includes(questionData.subject)) {
                            // Computer Science subject
                            if (["9th", "10th"].includes(questionData.class)) {
                              types = computerScience9th10thQuestionTypes
                            } else if (["11th", "12th", "1st Year", "2nd Year"].includes(questionData.class)) {
                              types = computerScience11th12thQuestionTypes
                            }
                          } else {
                            // For other subjects, show default question types
                            types = [
                              {
                                type: "mcqs",
                                marks: 1,
                                statement: "Choose the correct option",
                              },
                              {
                                type: "short",
                                marks: 2,
                                statement: "Write short answers to the following questions.",
                              },
                              {
                                type: "long",
                                marks: 5,
                                statement: "Write detailed answers to the following questions.",
                              },
                            ]
                          }

                          if (types.length === 0) {
                            return (
                              <div className="col-span-2 text-center p-4 bg-gray-50 rounded-lg">
                                {shouldUseUrduFont(questionData.subject)
                                  ? "براہ کرم سوال کی قسمیں دیکھنے کے لیے کلاس اور مضمون کا انتخاب کریں"
                                  : "Please select a class and subject to view question types"}
                              </div>
                            )
                          }

                          return types.map((item, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-4 rounded-xl cursor-pointer text-center transition-all duration-300 ${
                                questionData.type === item.type
                                  ? "bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-500 shadow-md"
                                  : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-purple-200"
                              }`}
                              onClick={() =>
                                setQuestionData((prev) => ({
                                  ...prev,
                                  type: item.type,
                                  marks: String(item.marks),
                                  statement: item.statement,
                                }))
                              }
                            >
                              <h3
                                className={combineClasses(
                                  "font-medium text-gray-800",
                                  shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right text-xl" : "",
                                )}
                              >
                                {shouldUseUrduFont(questionData.subject) && item.urduLabel
                                  ? item.urduLabel
                                  : getDisplayNameForType(item.type)}
                              </h3>
                              <div
                                className={combineClasses(
                                  "text-sm text-gray-500 mt-1",
                                  shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right" : "",
                                )}
                              >
                                {shouldUseUrduFont(questionData.subject)
                                  ? `${item.marks} ${item.marks === 1 ? "نمبر" : "نمبرات"}`
                                  : `${item.marks} ${item.marks === 1 ? "Mark" : "Marks"}`}
                              </div>
                              <div
                                className={combineClasses(
                                  "text-xs text-gray-400 mt-1",
                                  shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right" : "",
                                )}
                              >
                                {item.statement}
                              </div>
                            </motion.div>
                          ))
                        })()}
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="space-y-4">
                      <h2
                        className={combineClasses(
                          "text-xl font-semibold text-gray-800",
                          shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right" : "",
                        )}
                      >
                        {shouldUseUrduFont(questionData.subject) ? "سوال کی تفصیلات" : "Question Details"}
                      </h2>
                      {/* Question Statement */}
                      <div className="mb-4">
                        <label
                          className={combineClasses(
                            "block text-sm font-medium text-gray-700 mb-2",
                            shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right" : "",
                          )}
                        >
                          {shouldUseUrduFont(questionData.subject) ? "سوال کا بیان" : "Question Statement"}
                        </label>
                        <div
                          className={combineClasses(
                            "w-full p-3 border rounded-lg bg-gray-50",
                            questionData.medium === "URDU MEDIUM" ? "font-nastaliq text-right" : "",
                          )}
                          style={getTextStyle(questionData.medium)}
                        >
                          {renderMathText(questionData.statement)}
                        </div>
                      </div>
                      <div>
                        <label
                          className={combineClasses(
                            "block text-sm font-medium text-gray-700 mb-2",
                            shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right" : "",
                          )}
                        >
                          {shouldUseUrduFont(questionData.subject) ? "سوال کا متن" : "Question Text"}
                        </label>
                        
                        {/* Math Helper Toggle - Only for Mathematics */}
                        {questionData.subject === 'Mathematics' && (
                          <div className="mb-2">
                            <button
                              type="button"
                              onClick={() => setShowMathHelper(!showMathHelper)}
                              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                              {showMathHelper ? 'Hide' : 'Show'} Math Helper
                            </button>
                          </div>
                        )}
                        
                        {/* Math Input Helper - Only for Mathematics */}
                        {questionData.subject === 'Mathematics' && showMathHelper && (
                          <MathInputHelper onInsert={insertMathAtCursor} />
                        )}
                        
                        <textarea
                          ref={(ref) => {
                            setQuestionTextRef(ref)
                          }}
                          value={questionData.text}
                          onChange={(e) => {
                            if (questionData.subject === 'Mathematics' || questionData.subject === 'Math') {
                              handleTextInput(e, (value) => setQuestionData((prev) => ({ ...prev, text: value })));
                            } else {
                              setQuestionData((prev) => ({
                                ...prev,
                                text: e.target.value,
                              }));
                            }
                          }}
                          className={combineClasses(
                            "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                            questionData.medium === "URDU MEDIUM" || questionData.type === "u_to_e"
                              ? "font-nastaliq text-right"
                              : "",
                          )}
                          style={{
                            ...getTextStyle(questionData.medium),
                            ...getQuestionTextStyle(questionData.type),
                            whiteSpace: "pre-wrap",
                          }}
                          rows="4"
                          placeholder={
                            shouldUseUrduFont(questionData.subject) || questionData.type === "u_to_e"
                              ? "یہاں اپنا سوال درج کریں..."
                              : questionData.subject === 'Mathematics' || questionData.subject === 'Math'
                                ? "Enter your question here. Type 'x square' for x², or use symbols like √, π, α directly..."
                                : "Enter your question here..."
                          }
                        />
                        
                        {/* Math Preview - Only for Mathematics */}
                        {questionData.subject === 'Mathematics' && questionData.text && (
                          <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded">
                            <div className="text-sm font-medium text-gray-600 mb-2">Math Preview:</div>
                            <div className="text-gray-800">
                              {renderMathText(questionData.text)}
                            </div>
                          </div>
                        )}
                        
                        {/* Regular preview for non-Mathematics subjects */}
                        {questionData.subject !== 'Mathematics' && questionData.text && (
                          <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded">
                            <div className="text-sm font-medium text-gray-600 mb-2">Preview:</div>
                            <div className="text-gray-800 whitespace-pre-wrap">
                              {questionData.text}
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Question Type Specific Fields */}
                      {renderQuestionTypeFields()}
                      {/* Source Selection */}
                      <div className="mb-4">
                        <label
                          className={combineClasses(
                            "block text-sm font-medium text-gray-700 mb-2",
                            shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right" : "",
                          )}
                        >
                          {shouldUseUrduFont(questionData.subject) ? "سوال کا ماخذ" : "Question Source"}
                        </label>
                        <select
                          value={questionData.source}
                          onChange={(e) =>
                            setQuestionData((prev) => ({
                              ...prev,
                              source: e.target.value,
                            }))
                          }
                          className={combineClasses(
                            "w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500",
                            shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right" : "",
                          )}
                        >
                          <option value="exercise">
                            {shouldUseUrduFont(questionData.subject) ? "مشق" : "Exercise"}
                          </option>
                          <option value="additional">
                            {shouldUseUrduFont(questionData.subject) ? "اضافی" : "Additional"}
                          </option>
                          <option value="pastPapers">
                            {shouldUseUrduFont(questionData.subject) ? "گزشتہ پرچے" : "Past Papers"}
                          </option>
                        </select>
                      </div>

                      {/* Image addition*/}

                      <div className="space-y-4">
                        <label
                          className={combineClasses(
                            "block text-sm font-medium text-gray-700 mb-2",
                            shouldUseUrduFont(questionData.subject) ? "font-nastaliq text-right" : "",
                          )}
                        >
                          {shouldUseUrduFont(questionData.subject)
                            ? "تصاویر (زیادہ سے زیادہ 5 تصاویر)"
                            : "Images (Max 5 images)"}
                        </label>

                        {questionData.images?.length > 0 && (
                          <div className="flex flex-wrap gap-4 mb-4">
                            {questionData.images.map((img, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={img || "/placeholder.svg"}
                                  alt={`Question image ${index}`}
                                  className="h-32 w-32 object-cover rounded-lg border"
                                  onError={(e) => {
                                    e.target.src = "/placeholder-image.png"
                                    e.target.alt = "Failed to load image"
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  aria-label={
                                    shouldUseUrduFont(questionData.subject) ? "تصویر حذف کریں" : "Remove image"
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <label className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          {shouldUseUrduFont(questionData.subject) ? "تصاویر شامل کریں" : "Add Images"}
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={questionData.images?.length >= 5}
                          />
                        </label>
                        {questionData.images?.length >= 5 && (
                          <p className="text-sm text-red-500">
                            {shouldUseUrduFont(questionData.subject)
                              ? "زیادہ سے زیادہ 5 تصاویر شامل کی جا سکتی ہیں"
                              : "Maximum 5 images allowed"}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
                      >
                        {shouldUseUrduFont(questionData.subject) ? "سوال شامل کریں" : "Add Question"}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
