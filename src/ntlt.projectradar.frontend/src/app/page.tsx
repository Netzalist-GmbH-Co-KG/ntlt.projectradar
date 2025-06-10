interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

async function getWeatherData(): Promise<WeatherForecast[]> {
  try {
    // Aspire provides the backend URL via environment variable
    const backendUrl = process.env.services__backend__http__0 || process.env.services__backend__https__0;
    
    if (!backendUrl) {
      console.error('Backend URL not found in environment variables');
      return [];
    }

    const response = await fetch(`${backendUrl}/WeatherForecast`, {
      cache: 'no-store' // Don't cache for demo purposes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return [];
  }
}

export default async function Home() {
  const weatherData = await getWeatherData();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Project Radar - MVP Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Weather Service Test</h2>
        {weatherData.length > 0 ? (
          <div>
            <p className="mb-4 text-green-600">✅ Backend connection successful!</p>
            <table className="border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Date</th>
                  <th className="border border-gray-300 px-4 py-2">Temp (°C)</th>
                  <th className="border border-gray-300 px-4 py-2">Temp (°F)</th>
                  <th className="border border-gray-300 px-4 py-2">Summary</th>
                </tr>
              </thead>
              <tbody>
                {weatherData.map((forecast, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{forecast.date}</td>
                    <td className="border border-gray-300 px-4 py-2">{forecast.temperatureC}</td>
                    <td className="border border-gray-300 px-4 py-2">{forecast.temperatureF}</td>
                    <td className="border border-gray-300 px-4 py-2">{forecast.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <p className="text-red-600">❌ Backend connection failed</p>
            <p className="text-sm text-gray-600 mt-2">
              Backend URL: {process.env.services__backend__http__0 || process.env.services__backend__https__0 || 'Not found'}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <p className="text-sm">Backend HTTP URL: {process.env.services__backend__http__0 || 'Not set'}</p>
        <p className="text-sm">Backend HTTPS URL: {process.env.services__backend__https__0 || 'Not set'}</p>
      </div>
    </div>
  );
}
