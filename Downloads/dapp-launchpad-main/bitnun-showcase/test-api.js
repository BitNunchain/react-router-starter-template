// Simple test script to check API endpoints
const test = async () => {
  try {
    console.log('Testing blockchain stats API...');
    const response = await fetch('http://localhost:3001/api/blockchain-stats');
    const data = await response.json();
    console.log('Blockchain Stats:', JSON.stringify(data, null, 2));
    
    console.log('\nTesting projects API...');
    const projectsResponse = await fetch('http://localhost:3001/api/projects');
    const projectsData = await projectsResponse.json();
    console.log('Projects:', JSON.stringify(projectsData, null, 2));
    
  } catch (error) {
    console.error('Error testing APIs:', error);
  }
};

// Run the test
test();