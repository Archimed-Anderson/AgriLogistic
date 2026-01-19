#!/usr/bin/env node

/**
 * Script de vérification de santé des services
 * Vérifie que tous les services sont opérationnels
 */

// Using native fetch (Node.js 18+)

const services = [
  {
    name: 'Auth Service',
    url: 'http://localhost:3001/health',
    required: true,
  },
  {
    name: 'API Gateway (Kong)',
    url: 'http://localhost:8000/health',
    required: false,
  },
  {
    name: 'PostgreSQL',
    url: null, // Vérifié via auth-service
    required: true,
  },
  {
    name: 'Redis',
    url: null, // Vérifié via auth-service
    required: false,
  },
];

async function checkService(service) {
  if (!service.url) {
    return { name: service.name, status: 'skipped', required: service.required };
  }

  try {
    const response = await fetch(service.url, {
      method: 'GET',
      timeout: 5000,
    });

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        name: service.name,
        status: 'healthy',
        required: service.required,
        data,
      };
    } else {
      return {
        name: service.name,
        status: 'unhealthy',
        required: service.required,
        statusCode: response.status,
      };
    }
  } catch (error) {
    return {
      name: service.name,
      status: 'unreachable',
      required: service.required,
      error: error.message,
    };
  }
}

async function checkDatabase() {
  try {
    const response = await fetch('http://localhost:3001/health');
    if (response.ok) {
      const data = await response.json();
      return {
        name: 'PostgreSQL',
        status: data.database === 'connected' ? 'healthy' : 'unhealthy',
        required: true,
      };
    }
  } catch (error) {
    return {
      name: 'PostgreSQL',
      status: 'unreachable',
      required: true,
      error: error.message,
    };
  }
}

async function main() {
  console.log('🏥 Vérification de santé des services...\n');

  const results = [];

  // Vérifier les services HTTP
  for (const service of services) {
    if (service.url) {
      const result = await checkService(service);
      results.push(result);
    }
  }

  // Vérifier la base de données via auth-service
  const dbResult = await checkDatabase();
  results.push(dbResult);

  // Afficher les résultats
  let hasErrors = false;

  results.forEach(result => {
    const icon = result.status === 'healthy' ? '✅' : 
                 result.status === 'skipped' ? '⏭️ ' :
                 result.required ? '❌' : '⚠️ ';
    
    console.log(`${icon} ${result.name}: ${result.status}`);
    
    if (result.status === 'unhealthy' || result.status === 'unreachable') {
      if (result.required) {
        hasErrors = true;
      }
      if (result.error) {
        console.log(`   Erreur: ${result.error}`);
      }
      if (result.statusCode) {
        console.log(`   Code HTTP: ${result.statusCode}`);
      }
    }
  });

  console.log('');

  if (hasErrors) {
    console.log('❌ Des services critiques sont indisponibles. Veuillez les démarrer avant de continuer.\n');
    process.exit(1);
  } else {
    console.log('✅ Tous les services critiques sont opérationnels!\n');
    process.exit(0);
  }
}

main().catch(error => {
  console.error('❌ Erreur lors de la vérification:', error);
  process.exit(1);
});
