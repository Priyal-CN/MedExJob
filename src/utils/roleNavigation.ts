// Utility function to test role-based navigation
export const testRoleNavigation = (userRole: string) => {
  const normalizedRole = userRole ? String(userRole).toUpperCase() : '';
  
  console.log('🧪 Testing role navigation for:', normalizedRole);
  console.log('🧪 Role type:', typeof normalizedRole);
  console.log('🧪 Role comparisons:');
  console.log('  - ADMIN:', normalizedRole === 'ADMIN');
  console.log('  - EMPLOYER:', normalizedRole === 'EMPLOYER');
  console.log('  - CANDIDATE:', normalizedRole === 'CANDIDATE');
  
  if (normalizedRole === 'ADMIN') {
    console.log('✅ Should navigate to: /dashboard/admin');
    return '/dashboard/admin';
  } else if (normalizedRole === 'EMPLOYER') {
    console.log('✅ Should navigate to: /dashboard/employer');
    return '/dashboard/employer';
  } else if (normalizedRole === 'CANDIDATE') {
    console.log('✅ Should navigate to: /dashboard/candidate');
    return '/dashboard/candidate';
  } else {
    console.log('❌ Unknown role, defaulting to: /dashboard/candidate');
    return '/dashboard/candidate';
  }
};

// Test all possible role values
export const testAllRoles = () => {
  console.log('🧪 Testing all possible role values:');
  testRoleNavigation('admin');
  testRoleNavigation('ADMIN');
  testRoleNavigation('employer');
  testRoleNavigation('EMPLOYER');
  testRoleNavigation('candidate');
  testRoleNavigation('CANDIDATE');
  testRoleNavigation('unknown');
  testRoleNavigation('');
  testRoleNavigation(null as any);
};






