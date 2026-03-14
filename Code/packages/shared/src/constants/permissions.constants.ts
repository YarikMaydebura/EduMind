import type { UserRole } from '../types/user.types';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  TECH_ADMIN: [
    'system.manage',
    'system.view_logs',
    'system.feature_flags',
    'system.impersonate',
    'tenants.manage',
    'tenants.view_all',
    'users.manage_all',
  ],
  SCHOOL_ADMIN: [
    'school.manage',
    'school.settings',
    'school.billing',
    'teachers.manage',
    'teachers.invite',
    'students.manage',
    'students.view_all',
    'classes.view_all',
    'analytics.school',
    'ai.manage_limits',
  ],
  TEACHER: [
    'classes.create',
    'classes.manage_own',
    'lessons.create',
    'lessons.manage_own',
    'homework.create',
    'homework.grade',
    'quizzes.create',
    'students.view_own_class',
    'students.invite',
    'ai.generate_content',
    'ai.check_homework',
    'analytics.own_classes',
  ],
  STUDENT: [
    'homework.submit',
    'quizzes.take',
    'students.view_own',
    'gamification.view',
    'gamification.battle',
    'ai.student_tutor',
    'profile.edit_own',
    'social.follow',
    'social.leaderboard',
  ],
  PARENT: [
    'students.view_own',
    'gamification.view',
    'analytics.child',
    'messages.send',
  ],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
