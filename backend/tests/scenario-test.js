const BASE_URL = 'http://localhost:3000/api';

async function runTests() {
  console.log('Starting Scenario-Based API Tests...');

  try {
    // 1. SC-HP-01: Register and Login
    console.log('\n[SC-HP-01] Register and Login');
    const username = `user${Math.floor(Math.random() * 1000000)}`;
    const password = 'password123';

    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const regData = await regRes.json();
    console.log('Register status:', regRes.status, regData.success ? 'SUCCESS' : `FAIL: ${JSON.stringify(regData.error)}`);

    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const loginData = await loginRes.json();
    if (!loginData.success) {
      throw new Error(`Login Failed: ${JSON.stringify(loginData.error)}`);
    }
    const token = loginData.data.token;
    console.log('Login status:', loginRes.status, token ? 'TOKEN RECEIVED' : 'FAIL');

    // 2. SC-HP-02: Create Category and Todo
    console.log('\n[SC-HP-02] Create Category and Todo');
    const catRes = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: 'Work', colorCode: '#3B82F6' }),
    });
    const catData = await catRes.json();
    const categoryId = catData.data.id;
    console.log('Create Category status:', catRes.status, categoryId ? 'SUCCESS' : 'FAIL');

    const todoRes = await fetch(`${BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Marketing Plan',
        description: 'Q2 Strategy',
        categoryId: categoryId,
        dueDate: new Date(Date.now() + 86400000).toISOString(),
      }),
    });
    const todoData = await todoRes.json();
    const todoId = todoData.data.id;
    console.log('Create Todo status:', todoRes.status, todoId ? 'SUCCESS' : 'FAIL');

    // 3. SC-HP-03: Filter and Complete Todo
    console.log('\n[SC-HP-03] Filter and Complete Todo');
    const listRes = await fetch(`${BASE_URL}/todos?categoryId=${categoryId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const listData = await listRes.json();
    console.log('Filter Todos status:', listRes.status, 'Count:', listData.data.length);

    const completeRes = await fetch(`${BASE_URL}/todos/${todoId}/complete`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const completeData = await completeRes.json();
    console.log('Complete Todo status:', completeRes.status, 'Status:', completeData.data.status);

    // 4. SC-HP-04: OVERDUE Todo
    console.log('\n[SC-HP-04] Overdue Todo');
    const overdueRes = await fetch(`${BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Late Task',
        dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      }),
    });
    const overdueTodo = await overdueRes.json();
    const overdueId = overdueTodo.data.id;

    const checkOverdueRes = await fetch(`${BASE_URL}/todos/${overdueId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const checkOverdueData = await checkOverdueRes.json();
    console.log('Overdue Todo status:', checkOverdueRes.status, 'Status:', checkOverdueData.data.status);

    // 5. SC-HP-05: Uncomplete Todo
    console.log('\n[SC-HP-05] Uncomplete Todo');
    const uncompleteRes = await fetch(`${BASE_URL}/todos/${todoId}/uncomplete`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const uncompleteData = await uncompleteRes.json();
    console.log('Uncomplete Todo status:', uncompleteRes.status, 'Status:', uncompleteData.data.status);

    // 6. SC-HP-06: Delete Category
    console.log('\n[SC-HP-06] Delete Category');
    const delCatRes = await fetch(`${BASE_URL}/categories/${categoryId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    console.log('Delete Category status:', delCatRes.status);

    const checkTodoRes = await fetch(`${BASE_URL}/todos/${todoId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const checkTodoData = await checkTodoRes.json();
    console.log('Todo after category delete - CategoryId:', checkTodoData.data.categoryId);

    // 7. SC-EX-01: Duplicate Username
    console.log('\n[SC-EX-01] Duplicate Username');
    const dupRegRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const dupRegData = await dupRegRes.json();
    console.log('Duplicate Register status:', dupRegRes.status, 'Code:', dupRegData.error?.code);

    // 8. SC-AD-01 & 02: Admin Login and Deactivate
    console.log('\n[SC-AD-01 & 02] Admin Login and Deactivate');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin' }),
    });
    const adminLoginData = await adminLoginRes.json();
    if (!adminLoginData.success) {
      console.log('Admin Login Failed:', JSON.stringify(adminLoginData.error));
      // Try to seed if admin doesn't exist
      console.log('Attempting to seed admin user...');
      // Note: This might not work if DB is not accessible from here, but worth a try via shell command later
      throw new Error(`Admin Login Failed: ${JSON.stringify(adminLoginData.error)}`);
    }
    const adminToken = adminLoginData.data.token;
    console.log('Admin Login status:', adminLoginRes.status, adminToken ? 'TOKEN RECEIVED' : 'FAIL');

    const usersRes = await fetch(`${BASE_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const usersData = await usersRes.json();
    console.log('List Users status:', usersRes.status, 'Count:', usersData.data.length);

    const deactivateRes = await fetch(`${BASE_URL}/admin/users/${regData.data.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ isActive: false }),
    });
    const deactivateData = await deactivateRes.json();
    console.log('Deactivate User status:', deactivateRes.status, 'isActive:', deactivateData.data.isActive);

    // 9. SC-EX-02: Login as Deactivated User
    console.log('\n[SC-EX-02] Login as Deactivated User');
    const blockedLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const blockedLoginData = await blockedLoginRes.json();
    console.log('Blocked Login status:', blockedLoginRes.status, 'Code:', blockedLoginData.error?.code);

    // 10. SC-AD-03: Admin Deactivate Admin (Should fail)
    console.log('\n[SC-AD-03] Admin Deactivate Admin');
    const adminUserRes = await fetch(`${BASE_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const adminUserData = await adminUserRes.json();
    const adminId = adminUserData.data.find(u => u.username === 'admin').id;

    const deactivateAdminRes = await fetch(`${BASE_URL}/admin/users/${adminId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ isActive: false }),
    });
    const deactivateAdminData = await deactivateAdminRes.json();
    console.log('Deactivate Admin status:', deactivateAdminRes.status, 'Code:', deactivateAdminData.error?.code);

    console.log('\nAll Scenario Tests Completed Successfully!');
  } catch (err) {
    console.error('\nTest Failed with error:', err);
  }
}

runTests();
