import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

import { seedCharacterClasses } from './seed-character-classes';
import { seedSkills } from './seed-skills';

const prisma = new PrismaClient();

/**
 * Creates test data for local development:
 * - 1 Tenant (school)
 * - 1 Teacher + 1 School Admin
 * - 2 Classes (Math, Physics)
 * - 5 Students enrolled in both classes with varied XP/levels
 *
 * Login credentials:
 *   teacher@test.com   / Test1234
 *   admin@test.com     / Test1234
 *   student1@test.com  / Test1234  (Alice — top student)
 *   student2@test.com  / Test1234  (Bob)
 *   student3@test.com  / Test1234  (Carol)
 *   student4@test.com  / Test1234  (Dave)
 *   student5@test.com  / Test1234  (Eve)
 */
async function main() {
  console.log('Creating test data...');

  const password = hashSync('Test1234', 12);

  // ── Tenant ─────────────────────────────────────────────────────────
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'test-school' },
    update: {},
    create: {
      name: 'Test School',
      slug: 'test-school',
      type: 'SCHOOL',
      plan: 'FREE_TRIAL',
      settings: {},
    },
  });
  console.log('Tenant:', tenant.id);

  // ── Admin ──────────────────────────────────────────────────────────
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      passwordHash: password,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SCHOOL_ADMIN',
      tenantId: tenant.id,
      isActive: true,
    },
  });
  await prisma.schoolAdmin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: { userId: adminUser.id },
  });

  // ── Teacher ────────────────────────────────────────────────────────
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@test.com' },
    update: {},
    create: {
      email: 'teacher@test.com',
      passwordHash: password,
      firstName: 'John',
      lastName: 'Teacher',
      role: 'TEACHER',
      tenantId: tenant.id,
      isActive: true,
    },
  });
  const teacher = await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: { userId: teacherUser.id },
  });

  // ── Classes ────────────────────────────────────────────────────────
  const mathClass = await prisma.class.upsert({
    where: { id: 'test-math-class' },
    update: {},
    create: {
      id: 'test-math-class',
      tenantId: tenant.id,
      teacherId: teacher.id,
      name: 'Mathematics 101',
      subject: 'MATHEMATICS',
      gradeYear: 'GRADE_7',
    },
  });

  const physicsClass = await prisma.class.upsert({
    where: { id: 'test-physics-class' },
    update: {},
    create: {
      id: 'test-physics-class',
      tenantId: tenant.id,
      teacherId: teacher.id,
      name: 'Physics Fundamentals',
      subject: 'PHYSICS',
      gradeYear: 'GRADE_7',
    },
  });

  // ── Students ───────────────────────────────────────────────────────
  const studentData = [
    {
      email: 'student1@test.com',
      firstName: 'Alice',
      lastName: 'Anderson',
      totalXp: 4200,
      overallLevel: 12,
      currentGrade: 'B',
      streakDays: 14,
      longestStreak: 21,
      title: 'Dedicated',
      classXpMath: 2500,
      classXpPhysics: 1700,
      classLevelMath: 8,
      classLevelPhysics: 6,
      classGradeMath: 'B',
      classGradePhysics: 'C',
    },
    {
      email: 'student2@test.com',
      firstName: 'Bob',
      lastName: 'Brown',
      totalXp: 3100,
      overallLevel: 9,
      currentGrade: 'C',
      streakDays: 5,
      longestStreak: 12,
      title: null,
      classXpMath: 1800,
      classXpPhysics: 1300,
      classLevelMath: 6,
      classLevelPhysics: 5,
      classGradeMath: 'C',
      classGradePhysics: 'C',
    },
    {
      email: 'student3@test.com',
      firstName: 'Carol',
      lastName: 'Chen',
      totalXp: 5800,
      overallLevel: 15,
      currentGrade: 'A',
      streakDays: 30,
      longestStreak: 30,
      title: 'Outstanding',
      classXpMath: 3200,
      classXpPhysics: 2600,
      classLevelMath: 10,
      classLevelPhysics: 8,
      classGradeMath: 'A',
      classGradePhysics: 'B',
    },
    {
      email: 'student4@test.com',
      firstName: 'Dave',
      lastName: 'Davis',
      totalXp: 1200,
      overallLevel: 4,
      currentGrade: 'D',
      streakDays: 0,
      longestStreak: 3,
      title: null,
      classXpMath: 700,
      classXpPhysics: 500,
      classLevelMath: 3,
      classLevelPhysics: 2,
      classGradeMath: 'D',
      classGradePhysics: 'E',
    },
    {
      email: 'student5@test.com',
      firstName: 'Eve',
      lastName: 'Evans',
      totalXp: 2400,
      overallLevel: 7,
      currentGrade: 'C',
      streakDays: 2,
      longestStreak: 7,
      title: null,
      classXpMath: 1400,
      classXpPhysics: 1000,
      classLevelMath: 5,
      classLevelPhysics: 4,
      classGradeMath: 'C',
      classGradePhysics: 'D',
    },
  ];

  for (const sd of studentData) {
    const user = await prisma.user.upsert({
      where: { email: sd.email },
      update: {},
      create: {
        email: sd.email,
        passwordHash: password,
        firstName: sd.firstName,
        lastName: sd.lastName,
        role: 'STUDENT',
        tenantId: tenant.id,
        isActive: true,
      },
    });

    const student = await prisma.student.upsert({
      where: { userId: user.id },
      update: {
        totalXp: sd.totalXp,
        overallLevel: sd.overallLevel,
        currentGrade: sd.currentGrade,
        streakDays: sd.streakDays,
        longestStreak: sd.longestStreak,
        title: sd.title,
        lastActivityAt: sd.streakDays > 0 ? new Date() : null,
      },
      create: {
        userId: user.id,
        gradeYear: 'GRADE_7',
        totalXp: sd.totalXp,
        overallLevel: sd.overallLevel,
        currentGrade: sd.currentGrade,
        streakDays: sd.streakDays,
        longestStreak: sd.longestStreak,
        title: sd.title,
        lastActivityAt: sd.streakDays > 0 ? new Date() : null,
      },
    });

    // Enroll in both classes
    for (const cls of [
      { class: mathClass, xp: sd.classXpMath, level: sd.classLevelMath, grade: sd.classGradeMath },
      { class: physicsClass, xp: sd.classXpPhysics, level: sd.classLevelPhysics, grade: sd.classGradePhysics },
    ]) {
      await prisma.classEnrollment.upsert({
        where: {
          classId_studentId: { classId: cls.class.id, studentId: student.id },
        },
        update: {},
        create: {
          classId: cls.class.id,
          studentId: student.id,
          isActive: true,
        },
      });

      await prisma.studentClassProfile.upsert({
        where: {
          studentId_classId: { studentId: student.id, classId: cls.class.id },
        },
        update: {
          classXp: cls.xp,
          classLevel: cls.level,
          classGrade: cls.grade,
        },
        create: {
          studentId: student.id,
          classId: cls.class.id,
          classXp: cls.xp,
          classLevel: cls.level,
          classGrade: cls.grade,
        },
      });
    }

    console.log(`  Student: ${sd.firstName} ${sd.lastName} (${sd.email})`);
  }

  console.log('\nTest data created successfully!');
  console.log('\nLogin credentials (password for all: Test1234):');
  console.log('  Teacher:  teacher@test.com');
  console.log('  Admin:    admin@test.com');
  console.log('  Student1: student1@test.com (Alice - top student)');
  console.log('  Student2: student2@test.com (Bob)');
  console.log('  Student3: student3@test.com (Carol - highest XP)');
  console.log('  Student4: student4@test.com (Dave - lowest XP)');
  console.log('  Student5: student5@test.com (Eve)');

  // Seed character classes
  await seedCharacterClasses(prisma);

  // Seed skills (must run after character classes for Mythic exclusive class linking)
  await seedSkills(prisma);
}

main()
  .catch((e) => {
    console.error('Test data seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
