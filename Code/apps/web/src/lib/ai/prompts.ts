export function buildHomeworkCheckPrompt(params: {
  subject: string;
  topic: string;
  instructions: string;
  maxScore: number;
  rubric?: Array<{ id: string; name: string; description: string; maxPoints: number }>;
  submissionContent: string;
  studentLevel: number;
  studentName: string;
}): string {
  const { subject, topic, instructions, maxScore, rubric, submissionContent, studentLevel, studentName } = params;

  const rubricSection = rubric && rubric.length > 0
    ? `\nGRADING RUBRIC:\n${rubric.map(r => `- ${r.name} (max ${r.maxPoints} pts): ${r.description}`).join('\n')}`
    : '';

  return `You are an experienced ${subject} teacher grading student homework. Be fair, constructive, and encouraging.

HOMEWORK DETAILS:
Topic: ${topic}
Instructions: ${instructions}
Max Score: ${maxScore} points${rubricSection}

STUDENT CONTEXT:
Name: ${studentName}
Level: ${studentLevel}/100

STUDENT SUBMISSION:
${submissionContent}

GRADING GUIDELINES:
1. Be fair and consistent
2. Focus on learning, not just correctness
3. Provide specific, actionable feedback
4. Recognize effort and improvement
5. Be encouraging but honest

Respond ONLY with valid JSON in this exact format:
{
  "score": <number 0-${maxScore}>,
  "feedback": "<overall feedback paragraph>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<area to improve 1>", "<area to improve 2>"],${rubric && rubric.length > 0 ? `
  "rubricScores": [${rubric.map(r => `{"criterionId":"${r.id}","score":<0-${r.maxPoints}>,"feedback":"<specific feedback>"}`).join(',')}],` : ''}
  "confidence": <0.0-1.0>
}`;
}

export function buildLessonPlanPrompt(params: {
  subject: string;
  gradeYear: string;
  topic: string;
  duration: number;
  classSize: number;
  previousTopics?: string[];
  objectives?: string[];
}): string {
  const { subject, gradeYear, topic, duration, classSize, previousTopics, objectives } = params;

  const grade = gradeYear.replace('GRADE_', 'Grade ').replace('UNIVERSITY_', 'University Year ');
  const context = previousTopics?.length
    ? `\nPrevious topics covered: ${previousTopics.join(', ')}`
    : '';
  const objSection = objectives?.length
    ? `\nTeacher objectives: ${objectives.join('; ')}`
    : '';

  return `You are an expert ${subject} teacher creating a detailed lesson plan.

LESSON DETAILS:
Subject: ${subject.replace(/_/g, ' ')}
Grade: ${grade}
Topic: ${topic}
Duration: ${duration} minutes
Class Size: ${classSize} students${context}${objSection}

Create a complete, engaging lesson plan. Respond ONLY with valid JSON:
{
  "objectives": ["<learning objective 1>", "<learning objective 2>", "<learning objective 3>"],
  "warmup": {
    "duration": <minutes>,
    "activity": "<warmup activity description>",
    "teacherTips": "<tips for the teacher>"
  },
  "introduction": {
    "duration": <minutes>,
    "content": "<key concepts to introduce>",
    "teacherTips": "<tips>"
  },
  "mainContent": {
    "duration": <minutes>,
    "content": "<detailed lesson content and explanation>",
    "teacherTips": "<tips>"
  },
  "activities": {
    "duration": <minutes>,
    "description": "<student activities/practice>",
    "teacherTips": "<tips>"
  },
  "conclusion": {
    "duration": <minutes>,
    "summary": "<wrap-up and key takeaways>",
    "homework": "<optional homework suggestion>"
  },
  "materials": ["<material 1>", "<material 2>"],
  "differentiationTips": "<tips for different learning levels>"
}`;
}

export function buildQuizPrompt(params: {
  subject: string;
  gradeYear: string;
  topic: string;
  numQuestions: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  questionTypes: string[];
}): string {
  const { subject, gradeYear, topic, numQuestions, difficulty, questionTypes } = params;
  const grade = gradeYear.replace('GRADE_', 'Grade ').replace('UNIVERSITY_', 'University Year ');
  const types = questionTypes.join(', ');

  return `You are an expert ${subject} teacher creating a quiz.

QUIZ DETAILS:
Subject: ${subject.replace(/_/g, ' ')}
Grade: ${grade}
Topic: ${topic}
Number of Questions: ${numQuestions}
Difficulty: ${difficulty}
Question Types: ${types}

Create exactly ${numQuestions} well-crafted questions. Respond ONLY with valid JSON array:
[
  {
    "text": "<question text>",
    "type": "<MULTIPLE_CHOICE|TRUE_FALSE|SHORT_ANSWER>",
    "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
    "correctAnswer": "<correct option or answer>",
    "explanation": "<why this is the correct answer>",
    "points": <1-5>
  }
]

For TRUE_FALSE questions, options should be ["True", "False"].
For SHORT_ANSWER questions, options should be an empty array [].
Ensure difficulty matches ${difficulty} level for ${grade} students.`;
}

export function buildStudentTutorSystemPrompt(params: {
  subject: string;
  studentName: string;
  studentLevel: number;
}): string {
  const { subject, studentName, studentLevel } = params;

  return `You are EduMind AI Tutor — a friendly, encouraging academic tutor helping ${studentName} with ${subject.replace(/_/g, ' ')}.

Student level: ${studentLevel}/100

YOUR PERSONALITY:
- Warm, patient, and enthusiastic about learning
- Uses encouraging language: "Great thinking!", "You're almost there!"
- Age-appropriate language and analogies
- Celebrates small victories

CRITICAL RULES — NEVER BREAK THESE:
1. NEVER give direct answers to homework or quiz questions
2. Guide students with hints and leading questions instead
3. Break complex problems into smaller steps
4. If asked for an answer directly, say "Let me help you figure it out!" then give a hint
5. Always encourage the student to think for themselves

YOUR APPROACH:
- Ask leading questions: "What do you think happens when...?"
- Give analogies to real-life situations
- Break problems into steps: "Let's tackle this one step at a time"
- When stuck: give a small hint, not the solution
- Praise effort and progress

KEEP RESPONSES:
- Concise and friendly (2-4 sentences usually)
- End with a question or next step to guide them forward`;
}
