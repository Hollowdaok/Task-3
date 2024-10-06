// Визначення базових типів

type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

type TimeSlot = "8:30-10:00" | "10:15-11:45" | "12:15-13:45" | "14:00-15:30" | "15:45-17:15";

type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

// Створення основних структур

type Professor = {
  id: number;
  name: string;
  department: string;
};

type Classroom = {
  number: string;
  capacity: number;
  hasProjector: boolean;
};

type Course = {
  id: number;
  name: string;
  type: CourseType;
};

type Lesson = {
  id: number;
  courseId: number;
  professorId: number;
  classroomNumber: string;
  dayOfWeek: DayOfWeek;
  timeSlot: TimeSlot;
};

// Робота з масивами даних

let professors: Professor[] = [];
let classrooms: Classroom[] = [
  { number: "101", capacity: 30, hasProjector: true },
  { number: "102", capacity: 25, hasProjector: false },
  { number: "202", capacity: 50, hasProjector: true }
];
let courses: Course[] = [];
let schedule: Lesson[] = [];

function addProfessor(professor: Professor): void {
  professors.push(professor);
}

function addLesson(lesson: Lesson): boolean {
  const conflict = validateLesson(lesson);
  if (conflict === null) {
    schedule.push(lesson);
    return true;
  }
  return false;
}

// Функції пошуку та фільтрації

function findAvailableClassrooms(timeSlot: TimeSlot, dayOfWeek: DayOfWeek): string[] {
  const occupiedClassrooms = schedule
    .filter(lesson => lesson.timeSlot === timeSlot && lesson.dayOfWeek === dayOfWeek)
    .map(lesson => lesson.classroomNumber);

  return classrooms
    .filter(classroom => !occupiedClassrooms.includes(classroom.number))
    .map(classroom => classroom.number);
}

function getProfessorSchedule(professorId: number): Lesson[] {
  return schedule.filter(lesson => lesson.professorId === professorId);
}

// Обробка конфліктів та валідація

type ScheduleConflict = {
  type: "ProfessorConflict" | "ClassroomConflict";
  lessonDetails: Lesson;
};

function validateLesson(lesson: Lesson): ScheduleConflict | null {
  const professorConflict = schedule.find(
    l => l.professorId === lesson.professorId && 
         l.dayOfWeek === lesson.dayOfWeek && 
         l.timeSlot === lesson.timeSlot &&
         l.id !== lesson.id 
  );

  if (professorConflict) {
    return {
      type: "ProfessorConflict",
      lessonDetails: professorConflict
    };
  }

  const classroomConflict = schedule.find(
    l => l.classroomNumber === lesson.classroomNumber && 
        l.dayOfWeek === lesson.dayOfWeek && 
        l.timeSlot === lesson.timeSlot
  );

  if (classroomConflict) {
    return {
      type: "ClassroomConflict",
      lessonDetails: classroomConflict
    };
  }

  return null;
}

// Аналіз та звіти

function getClassroomUtilization(classroomNumber: string): number {
  const totalSlots = 5 * 5;
  const usedSlots = schedule.filter(lesson => lesson.classroomNumber === classroomNumber).length;
  return (usedSlots / totalSlots) * 100;
}

function getMostPopularCourseType(): CourseType {
  const courseTypeCounts: Record<CourseType, number> = {
    "Lecture": 0,
    "Seminar": 0,
    "Lab": 0,
    "Practice": 0
  };

  schedule.forEach(lesson => {
    const course = courses.find(c => c.id === lesson.courseId);
    if (course) {
      courseTypeCounts[course.type]++;
    }
  });

  return Object.entries(courseTypeCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0] as CourseType;
}

// Модифікація даних

function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
  const lessonIndex = schedule.findIndex(lesson => lesson.id === lessonId);
  if (lessonIndex === -1) return false;

  const updatedLesson = { ...schedule[lessonIndex], classroomNumber: newClassroomNumber };
  const conflict = validateLesson(updatedLesson);

  if (conflict === null) {
    schedule[lessonIndex] = updatedLesson;
    return true;
  }

  return false;
}


function cancelLesson(lessonId: number): void {
  const lessonIndex = schedule.findIndex(lesson => lesson.id === lessonId);
  if (lessonIndex !== -1) {
    schedule.splice(lessonIndex, 1);
  }
}

// Приклад використання

addProfessor({ id: 1, name: "Ivan Petrenko", department: "Computer Science" });

addProfessor({ id: 2, name: "Veronika Watson", department: "Ethics in Technology" });

courses.push({ id: 1, name: "Introduction to Programming", type: "Lecture" });
courses.push({ id: 2, name: "Ethics in Technology", type: "Lecture" });


const newLesson: Lesson = {
  id: 1,
  courseId: 1,
  professorId: 1,
  classroomNumber: "101",
  dayOfWeek: "Monday",
  timeSlot: "8:30-10:00"
};

if (addLesson(newLesson)) {
  console.log("Lesson added successfully");
} else {
  console.log("Failed to add lesson due to conflict");
}
const secondLesson: Lesson = {
  id: 2,
  courseId: 2,
  professorId: 2,
  classroomNumber: "202",
  dayOfWeek: "Wednesday",
  timeSlot: "12:15-13:45"
};

if (addLesson(secondLesson)) {
  console.log("Lesson added successfully");
} else {
  console.log("Failed to add lesson due to conflict");
}

const availableClassrooms = findAvailableClassrooms("10:15-11:45", "Monday");
console.log("Available classrooms:", availableClassrooms);

const professorSchedule = getProfessorSchedule(1);
console.log("Professor schedule:", professorSchedule);

const utilization = getClassroomUtilization("101");
console.log("Classroom utilization:", utilization + "%");

const mostPopularType = getMostPopularCourseType();
console.log("Most popular course type:", mostPopularType);

if (reassignClassroom(1, "102")) {
  console.log("Classroom reassigned successfully");
} else {
  console.log("Failed to reassign classroom");
}

cancelLesson(1);
console.log("Lesson cancelled");
