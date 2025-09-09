// 9th class imports
import { biologyUnits } from '@/app/generate-paper/9th/biology/unitsData'
import { physicsUnits as physicsUnits9 } from '@/app/generate-paper/9th/physics/unitsData'
import { chemistryUnits as chemistryUnits9 } from '@/app/generate-paper/9th/chemistry/unitsData'
import { computerScienceUnits as computerScienceUnits9 } from '@/app/generate-paper/9th/computer-science/unitsData'
import { englishUnits as englishUnits9 } from '@/app/generate-paper/9th/english/unitsData'
import { islamiyatUnits } from '@/app/generate-paper/9th/islamiat-ikhtiari/unitsData'
import { pakistanStudiesUnits } from '@/app/generate-paper/9th/pakistan-studies/unitsData'
import { urduUnits as urduUnits9 } from '@/app/generate-paper/9th/urdu/unitsData'
import { quranUnits as quranUnits9 } from '@/app/generate-paper/9th/quran-translation/unitsData'
// import { mathematicsUnits as mathUnits9 } from '@/app/generate-paper/9th/mathematics/unitsData'
import { mathematicsUnits as mathUnits9 } from '@/app/generate-paper/9th/mathematics/unitsData'

// 10th class imports
import { biologyUnits as biologyUnits10 } from '@/app/generate-paper/10th/biology/unitsData'
import { physicsUnits } from '@/app/generate-paper/10th/physics/unitsData'
import { chemistryUnits } from '@/app/generate-paper/10th/chemistry/unitsData'
import { computerScienceUnits } from '@/app/generate-paper/10th/computer-science/unitsData'
import { englishUnits } from '@/app/generate-paper/10th/english/unitsData'
import { mathUnits } from '@/app/generate-paper/10th/mathematics/unitsData'
import { pakStudiesUnits } from '@/app/generate-paper/10th/pakistan-studies/unitsData'
import { urduUnits } from '@/app/generate-paper/10th/urdu-lazmi/unitsData'
import { quranUnits } from '@/app/generate-paper/10th/quran-translation/unitsData'


// 11th class imports - update these lines
import { biologyUnits as biologyUnits11 } from '@/app/generate-paper/11th/biology/unitsData'
import { physicsUnits as physicsUnits11 } from '@/app/generate-paper/11th/physics/unitsData'
import { chemistryUnits as chemistryUnits11 } from '@/app/generate-paper/11th/chemistry/unitsData'
import { computerScienceUnits as computerScienceUnits11 } from '@/app/generate-paper/11th/computer-science/unitsData'
import { englishUnits as englishUnits11 } from '@/app/generate-paper/11th/english/unitsData'
import { mathematicsUnits as mathUnits11 } from '@/app/generate-paper/11th/mathematics/unitsData'
import { islamiatUnits as islamiyatUnits11 } from '@/app/generate-paper/11th/islamiat-lazmi/unitsData'
import { urduUnits as urduUnits11 } from '@/app/generate-paper/11th/urdu-lazmi/unitsData'

// Remove these lines
// import { quranUnits as quranUnits11 } from '@/app/generate-paper/11th/quran-translation/unitsData'
// import { quranUnits as quranUnits12 } from '@/app/generate-paper/12th/quran-translation/unitsData'
// import { quranTranslationUnits as quranUnits11 } from '@/app/generate-paper/11th/quran-translation/unitsData'
// import { quranTranslationUnits as quranUnits12 } from '@/app/generate-paper/12th/quran-translation/unitsData'

// Keep only these
import { quranTranslationUnits as quranUnits11 } from '@/app/generate-paper/11th/quran-translation/unitsData'
import { quranTranslationUnits as quranUnits12 } from '@/app/generate-paper/12th/quran-translation/unitsData'

// 12th class imports
import { biologyUnits as biologyUnits12 } from '@/app/generate-paper/12th/biology/unitsData'
import { physicsUnits as physicsUnits12 } from '@/app/generate-paper/12th/physics/unitsData'
import { chemistryUnits as chemistryUnits12 } from '@/app/generate-paper/12th/chemistry/unitsData'
import { computerScienceUnits as computerScienceUnits12 } from '@/app/generate-paper/12th/computer-science/unitsData'
import { englishUnits as englishUnits12 } from '@/app/generate-paper/12th/english/unitsData'
import { mathematicsUnits as mathUnits12 } from '@/app/generate-paper/12th/mathematics/unitsData'
import { pakistanStudiesUnits as pakStudiesUnits12 } from '@/app/generate-paper/12th/pakistan-studies/unitsData'
import { urduUnits as urduUnits12 } from '@/app/generate-paper/12th/urdu-lazmi/unitsData'
// Remove this duplicate import
// import { quranTranslationUnits as quranUnits12 from '@/app/generate-paper/12th/quran-translation/unitsData'

// Keep only one instance of the quranUnits12 import in the 12th class imports section
// import { biologyUnits as biologyUnits12 from '@/app/generate-paper/12th/biology/unitsData'
// import { physicsUnits as physicsUnits12 from '@/app/generate-paper/12th/physics/unitsData'
// import { chemistryUnits as chemistryUnits12 from '@/app/generate-paper/12th/chemistry/unitsData'
// import { computerScienceUnits as computerScienceUnits12 from '@/app/generate-paper/12th/computer-science/unitsData'
// import { englishUnits as englishUnits12 from '@/app/generate-paper/12th/english/unitsData'
// import { mathematicsUnits as mathUnits12 from '@/app/generate-paper/12th/mathematics/unitsData'
// import { pakistanStudiesUnits as pakStudiesUnits12 from '@/app/generate-paper/12th/pakistan-studies/unitsData'
// import { urduUnits as urduUnits12 from '@/app/generate-paper/12th/urdu-lazmi/unitsData'
// import { quranTranslationUnits as quranUnits12 from '@/app/generate-paper/12th/quran-translation/unitsData'

export const classData = {
  '9th': {
    subjects: ['Biology', 'Physics', 'Chemistry', 'Computer Science', 'English', 'Mathematics', 'Islamiat', 'Urdu', 'Quran'],
    chapters: {
      Biology: biologyUnits.map(unit => unit.title),
      Physics: physicsUnits9.map(unit => unit.title),
      Chemistry: chemistryUnits9.map(unit => unit.title),
      'Computer Science': computerScienceUnits9.map(unit => unit.title),
      English: englishUnits9.map(unit => unit.title),
      Islamiat: islamiyatUnits.map(unit => unit.title),
      'Pakistan Studies': pakistanStudiesUnits.map(unit => unit.title),
      'Urdu': urduUnits9.map(unit => unit.title), // Changed to return only title
      Quran: quranUnits9.map(unit => unit.title),
      Mathematics: mathUnits9.map(unit => unit.title),  // Remove the duplicate line
      // Mathematics: mathUnits9.map(unit => unit.title),
    },
    topics: {
      Biology: biologyUnits.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Physics: physicsUnits9.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Chemistry: chemistryUnits9.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      'Computer Science': computerScienceUnits9.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      English: englishUnits9.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Islamiat: islamiyatUnits.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      'Pakistan Studies': pakistanStudiesUnits.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Urdu: urduUnits9.reduce((acc, unit) => { // Changed from 'Urdu'
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Quran: quranUnits9.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Mathematics: mathUnits9.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
    }
  },
  '10th': {
    subjects: ['Biology', 'Physics', 'Chemistry', 'Computer Science', 'English', 'Mathematics', 'Pakistan Studies', 'Urdu', 'Quran'],
    chapters: {
      Biology: biologyUnits10.map(unit => unit.title),
      Physics: physicsUnits.map(unit => unit.title),
      Chemistry: chemistryUnits.map(unit => unit.title),
      'Computer Science': computerScienceUnits.map(unit => unit.title),
      English: englishUnits.map(unit => unit.title),
      Mathematics: mathUnits.map(unit => unit.title),
      'Pakistan Studies': pakStudiesUnits.map(unit => unit.title),
      Urdu: urduUnits.map(unit => unit.title),
      Quran: quranUnits.map(unit => unit.title)
    },
    topics: {
      Biology: biologyUnits10.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Physics: physicsUnits.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Chemistry: chemistryUnits.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      'Computer Science': computerScienceUnits.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      English: englishUnits.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Mathematics: mathUnits.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      'Pakistan Studies': pakStudiesUnits.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Urdu: urduUnits.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Quran: quranUnits.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {})
    }
  },
  
  '11th': {
    subjects: ['Biology', 'Physics', 'Chemistry', 'Computer Science', 'English', 'Mathematics', 'Islamiat', 'Urdu', 'Quran'],
    chapters: {
      Biology: biologyUnits11.map(unit => unit.title),
      Physics: physicsUnits11.map(unit => unit.title),
      Chemistry: chemistryUnits11.map(unit => unit.title),
      'Computer Science': computerScienceUnits11.map(unit => unit.title),
      English: englishUnits11.map(unit => unit.title),
      Mathematics: mathUnits11.map(unit => unit.title),
      Islamiat: islamiyatUnits11.map(unit => unit.title),  // Using the correct import alias
      Urdu: urduUnits11.map(unit => unit.title),
      Quran: quranUnits11.map(unit => unit.title)
    },
    topics: {
      Biology: biologyUnits11.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Physics: physicsUnits11.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Chemistry: chemistryUnits11.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      'Computer Science': computerScienceUnits11.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      English: englishUnits11.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Mathematics: mathUnits11.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Islamiat: islamiyatUnits11.reduce((acc, unit) => {  // Using the correct import alias
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Urdu: urduUnits11.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {}),
      Quran: quranUnits11.reduce((acc, unit) => {
        acc[unit.title] = unit.exercises;
        return acc;
      }, {})
    }
  },
  
  // Add this after the 11th class data
    '12th': {
      subjects: ['Biology', 'Physics', 'Chemistry', 'Computer Science', 'English', 'Mathematics', 'Pakistan Studies', 'Urdu', 'Quran'],
      chapters: {
        Biology: biologyUnits12.map(unit => unit.title),
        Physics: physicsUnits12.map(unit => unit.title),
        Chemistry: chemistryUnits12.map(unit => unit.title),
        'Computer Science': computerScienceUnits12.map(unit => unit.title),
        English: englishUnits12.map(unit => unit.title),
        Mathematics: mathUnits12.map(unit => unit.title),
        'Pakistan Studies': pakStudiesUnits12.map(unit => unit.title),
        Urdu: urduUnits12.map(unit => unit.title),
        Quran: quranUnits12.map(unit => unit.title)
      },
      topics: {
        Biology: biologyUnits12.reduce((acc, unit) => {
          acc[unit.title] = unit.exercises;
          return acc;
        }, {}),
        Physics: physicsUnits12.reduce((acc, unit) => {
          acc[unit.title] = unit.exercises;
          return acc;
        }, {}),
        Chemistry: chemistryUnits12.reduce((acc, unit) => {
          acc[unit.title] = unit.exercises;
          return acc;
        }, {}),
        'Computer Science': computerScienceUnits12.reduce((acc, unit) => {
          acc[unit.title] = unit.exercises;
          return acc;
        }, {}),
        English: englishUnits12.reduce((acc, unit) => {
          acc[unit.title] = unit.exercises;
          return acc;
        }, {}),
        Mathematics: mathUnits12.reduce((acc, unit) => {
          acc[unit.title] = unit.exercises;
          return acc;
        }, {}),
        'Pakistan Studies': pakStudiesUnits12.reduce((acc, unit) => {
          acc[unit.title] = unit.exercises;
          return acc;
        }, {}),
        Urdu: urduUnits12.reduce((acc, unit) => {
          acc[unit.title] = unit.exercises;
          return acc;
        }, {}),
        Quran: quranUnits12.reduce((acc, unit) => {
          acc[unit.title] = unit.exercises;
          return acc;
        }, {})
      }
    }
}
