import type { AttendanceRecord, AttendanceStatus, Student, Subject, Teacher } from '@/types'

// ---- Deterministic PRNG so the demo data is stable across reloads ----
function hashSeed(str: string): number {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed)
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function isoDateDaysAgo(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

// ---- Core demo entities ----
export const DEMO_TEACHER: Teacher = {
  id: 'teacher-1',
  name: 'Priya Menon',
  email: 'priya.menon@attendly.edu',
  teacherId: 'FAC-014',
  department: 'Computer Science & Engineering',
}

const CLASS_COURSE = 'B.Tech CSE · Sem 5'

export const DEMO_STUDENTS: Student[] = [
  { id: 'student-1', name: 'Arjun Sharma', email: 'arjun.sharma@attendly.edu', studentId: 'ST001', course: 'B.Tech CSE · Sem 5' },
  { id: 'student-2', name: 'Riya Das', email: 'riya.das@attendly.edu', studentId: 'ST002', course: 'B.Tech CSE · Sem 5' },
  { id: 'student-3', name: 'Rahul Singh', email: 'rahul.singh@attendly.edu', studentId: 'ST003', course: 'B.Tech CSE · Sem 5' },
  { id: 'student-4', name: 'Sneha Patil', email: 'sneha.patil@attendly.edu', studentId: 'ST004', course: 'B.Tech CSE · Sem 5' },
  { id: 'student-5', name: 'Karan Mehta', email: 'karan.mehta@attendly.edu', studentId: 'ST005', course: 'B.Tech CSE · Sem 5' },
  { id: 'student-6', name: 'Sumit Mohapatra', email: 'sumitmohapatra909@gmail.com', studentId: '32', course: CLASS_COURSE },
  { id: 'student-7', name: 'Abhyuday Mishra', email: 'abhyudaybls@gmail.com', studentId: '27', course: CLASS_COURSE },
  { id: 'student-8', name: 'Riya Kumari', email: 'riyamuskan12345@gmail.com', studentId: '23', course: CLASS_COURSE },
  { id: 'student-9', name: 'Shivam Kumar Nag', email: 'shivamkumarnagclg@gmail.com', studentId: '39', course: CLASS_COURSE },
  { id: 'student-10', name: 'Sai prasanna Dhal', email: 'saiprasannadhal@gmail.com', studentId: '13', course: CLASS_COURSE },
  { id: 'student-11', name: 'Deepsikha swain', email: 'deepsikhaswain01@gmail.com', studentId: '24E119G24', course: CLASS_COURSE },
  { id: 'student-12', name: 'Saumya Ranjan Nayak', email: 'saumyaranjannayak366@gmail.com', studentId: '37', course: CLASS_COURSE },
  { id: 'student-13', name: 'Swadhin Mohanty', email: 'mohantyswadhin243@gmail.com', studentId: '31', course: CLASS_COURSE },
  { id: 'student-14', name: 'Tamanna Parwin', email: 'parwintamanna0423@gmail.com', studentId: '45', course: CLASS_COURSE },
  { id: 'student-15', name: 'Abhijeet Mahakur', email: 'abhijeetmahakur67@gmail.com', studentId: '25', course: CLASS_COURSE },
  { id: 'student-16', name: 'Suhani Anand', email: 'suhanianand2005@gmail.com', studentId: '02', course: CLASS_COURSE },
  { id: 'student-17', name: 'Anish kumar', email: 'anishrex9636@gmail.com', studentId: '24E111B23', course: CLASS_COURSE },
  { id: 'student-18', name: 'Ayusman Pradhan', email: 'ayusmanpradhan1306@gmail.com', studentId: '44', course: CLASS_COURSE },
  { id: 'student-19', name: 'Bibhav Patnaik', email: 'bpatnaik0912@gmail.com', studentId: '41', course: CLASS_COURSE },
  { id: 'student-20', name: 'Jessica Gorai', email: 'goraijessica439@gmail.com', studentId: '15', course: CLASS_COURSE },
  { id: 'student-21', name: 'Sejal Kumari', email: 'kumarisejal21@gmail.com', studentId: '22', course: CLASS_COURSE },
  { id: 'student-22', name: 'Aarti sarraf', email: 'aartisarraf111@gmail.com', studentId: '59', course: CLASS_COURSE },
  { id: 'student-23', name: 'Ashutosh pattnaik', email: '2005ashutoshpattnaik@gmail.com', studentId: '24E116C59', course: CLASS_COURSE },
  { id: 'student-24', name: 'Smruti Suvangi Nayak', email: 'smrutisnayak.2006@gmail.com', studentId: '38', course: CLASS_COURSE },
  { id: 'student-25', name: 'Ritika Singh', email: 'ritikasingh.ritu21@gmail.com', studentId: '55', course: CLASS_COURSE },
  { id: 'student-26', name: 'Digambar Behera', email: 'beheradigambar563@gmail.com', studentId: '06', course: CLASS_COURSE },
  { id: 'student-27', name: 'Abhipsha Mishra', email: 'abhipshamishra198@gmail.com', studentId: '35', course: CLASS_COURSE },
  { id: 'student-28', name: 'Anuj Kumar Ghadia', email: 'anujghadia57@gmail.com', studentId: '14', course: CLASS_COURSE },
  { id: 'student-29', name: 'Subham patel', email: 'subhamjsg.patel@gmail.com', studentId: '24E116E38', course: CLASS_COURSE },
  { id: 'student-30', name: 'Uttara Das', email: 'dasuttara617@gmail.com', studentId: '11', course: CLASS_COURSE },
  { id: 'student-31', name: 'TEJESWAR LENKA', email: 'tejaswarlenka@gmail.com', studentId: '24', course: CLASS_COURSE },
  { id: 'student-32', name: 'Deep kumar Mohapatra', email: 'deepkumar84921@gmail.com', studentId: '33', course: CLASS_COURSE },
  { id: 'student-33', name: 'Swastik Kumar Sahu', email: 'swastikkumarsahu77@gmail.com', studentId: '52', course: CLASS_COURSE },
  { id: 'student-34', name: 'Akshat Jha', email: 'akshatjha3125@gmail.com', studentId: '16', course: CLASS_COURSE },
  { id: 'student-35', name: 'Tamanna Mahapatro', email: 'tamanna.mahapatro@gmail.com', studentId: '34', course: CLASS_COURSE },
  { id: 'student-36', name: 'Pushpak Kumar Bagadia', email: 'bagadiapuspak@gmail.com', studentId: '04', course: CLASS_COURSE },
  { id: 'student-37', name: 'Sayeda Umme Kulsum', email: 'kulsumsayeda3@gmail.com', studentId: '19', course: CLASS_COURSE },
  { id: 'student-38', name: 'Priyanshu Raj', email: 'priyanshurajput1230@gmail.com', studentId: '47', course: CLASS_COURSE },
  { id: 'student-39', name: 'Soubhagya Anupam Mishra', email: 'soubhagyamishra0012@gmail.com', studentId: '24E113B42', course: CLASS_COURSE },
  { id: 'student-40', name: 'Omm Prakash Nanda', email: 'ommprakashnanda2@gmail.com', studentId: '36', course: CLASS_COURSE },
  { id: 'student-41', name: 'Arman Amrit Sahoo', email: 'sahooarmanamrit@gmail.com', studentId: '49', course: CLASS_COURSE },
  { id: 'student-42', name: 'Girija Sankar Dhal', email: 'parbatirout589@gmail.com', studentId: '12', course: CLASS_COURSE },
  { id: 'student-43', name: 'Suhana Kuanra', email: 'kuanrasuhana@gmail.com', studentId: '18', course: CLASS_COURSE },
  { id: 'student-44', name: 'Ayush kumarr. chouddhary', email: 'ayushcrazy6724@gmail.com', studentId: '8', course: CLASS_COURSE },
]

const ALL_STUDENT_IDS = DEMO_STUDENTS.map((s) => s.id)

export const DEMO_SUBJECTS: Subject[] = [
  { id: 'subject-1', name: 'Mathematics', code: 'MAT101', teacherId: 'teacher-1', studentIds: ALL_STUDENT_IDS },
  { id: 'subject-2', name: 'Data Structures', code: 'CSE201', teacherId: 'teacher-1', studentIds: ALL_STUDENT_IDS },
  { id: 'subject-3', name: 'Database Management Systems', code: 'CSE310', teacherId: 'teacher-1', studentIds: ALL_STUDENT_IDS },
  { id: 'subject-4', name: 'Operating Systems', code: 'CSE305', teacherId: 'teacher-1', studentIds: ALL_STUDENT_IDS },
]

// Target present-rate per student, tuned so the dashboard shows a clear
// spread across high / medium / low attendance health states.
const STUDENT_BASE_RATE: Record<string, number> = {
  'student-1': 0.93, // Arjun — good
  'student-2': 0.81, // Riya — needs attention
  'student-3': 0.71, // Rahul — needs attention / borderline low
  'student-4': 0.6, // Sneha — low
  'student-5': 0.97, // Karan — good
}

// Small per-subject variance so a student's subjects aren't identical.
const SUBJECT_DELTA: Record<string, number> = {
  'subject-1': 0.02,
  'subject-2': -0.04,
  'subject-3': 0.0,
  'subject-4': -0.08,
}

// Session offsets (days ago) per subject. Mathematics' most recent session
// is "today" so the Take Attendance demo has a live record to edit.
const SESSION_OFFSETS: Record<string, number[]> = {
  'subject-1': [30, 27, 23, 20, 16, 13, 9, 6, 2, 0],
  'subject-2': [29, 26, 22, 19, 15, 12, 8, 5, 3],
  'subject-3': [28, 24, 21, 17, 14, 10, 7, 4, 1],
  'subject-4': [31, 25, 18, 11],
}

function buildAttendanceRecords(): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  let counter = 1

  for (const subject of DEMO_SUBJECTS) {
    const offsets = SESSION_OFFSETS[subject.id] ?? []
    for (const studentId of subject.studentIds) {
      const rate = Math.min(0.99, Math.max(0.4, (STUDENT_BASE_RATE[studentId] ?? 0.8) + (SUBJECT_DELTA[subject.id] ?? 0)))
      const sessionCount = offsets.length
      const presentCount = Math.round(rate * sessionCount)
      const seed = hashSeed(`${studentId}:${subject.id}`)
      const order = seededShuffle(
        offsets.map((_, idx) => idx),
        seed,
      )
      const presentIndices = new Set(order.slice(0, presentCount))

      offsets.forEach((daysAgo, idx) => {
        const status: AttendanceStatus = presentIndices.has(idx) ? 'present' : 'absent'
        records.push({
          id: `att-${counter++}`,
          studentId,
          subjectId: subject.id,
          date: isoDateDaysAgo(daysAgo),
          status,
          updatedAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
        })
      })
    }
  }

  return records.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export const DEMO_ATTENDANCE_RECORDS: AttendanceRecord[] = buildAttendanceRecords()

// Demo credentials shown on the login screens so reviewers can sign in
// instantly without needing a real backend.
export const DEMO_CREDENTIALS = {
  student: { email: DEMO_STUDENTS[0].email, password: 'demo1234' },
  teacher: { email: DEMO_TEACHER.email, password: 'demo1234' },
}
