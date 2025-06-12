import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import StatsCard from '../../components/admin/StatsCard';
import { 
  FaUsers, FaUserTie, FaFolder, FaClock, 
  FaCheckCircle, FaTimesCircle, FaMapMarkerAlt
} from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, 
  Title, Tooltip, Legend, ArcElement
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0, clients: 0, artisans: 0,
    categories: 0, cities: 0,
    verification: { approved: 0, pending: 0, rejected: 0 }
  });

  const [chartData, setChartData] = useState({
    usersByMonth: { labels: [], data: [] },
    artisansByCategory: { labels: [], data: [], backgroundColors: [] },
    artisansByCity: { labels: [], data: [] }
  });

  const CATEGORY_COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
  '#9966FF', '#FF9F40', '#8AC24A', '#607D8B',
  '#E91E63', '#9C27B0', '#3F51B5', '#009688'
];

  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [dashboardStats, usersByMonth, artisansByCategory, artisansByCity] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getUsersByMonth(),
        adminService.getArtisansByCategory(),
        adminService.getArtisansByCity()
      ]);

      // Générer des couleurs pour les catégories
      const categoryColors = CATEGORY_COLORS.slice(0, artisansByCategory.labels.length);

      setStats(dashboardStats);
      setChartData({
        usersByMonth,
        artisansByCategory: {
          ...artisansByCategory,
          backgroundColors: categoryColors
        },
        artisansByCity
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  // Chart options
  const chartOptions = (title) => ({
    responsive: true,
    plugins: { 
      legend: { position: 'top' }, 
      title: { 
        display: true, 
        text: title,
        font: { size: 16 }
      } 
    },
    maintainAspectRatio: false
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tableau de Bord Administrateur</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard 
          title="Total Utilisateurs" 
          value={stats.users} 
          icon={<FaUsers className="text-blue-500" />}
          trend="up"
        />
        <StatsCard 
          title="Clients" 
          value={stats.clients} 
          icon={<FaUsers className="text-green-500" />}
        />
        <StatsCard 
          title="Artisans" 
          value={stats.artisans} 
          icon={<FaUserTie className="text-purple-500" />}
        />
        <StatsCard 
          title="Catégories" 
          value={stats.categories} 
          icon={<FaFolder className="text-orange-500" />}
        />
        <StatsCard 
          title="Artisans Approuvés" 
          value={stats.verification.approved} 
          icon={<FaCheckCircle className="text-green-500" />}
        />
        <StatsCard 
          title="En Attente" 
          value={stats.verification.pending} 
          icon={<FaClock className="text-yellow-500" />}
        />
        <StatsCard 
          title="Rejetés" 
          value={stats.verification.rejected} 
          icon={<FaTimesCircle className="text-red-500" />}
        />
        <StatsCard 
          title="Villes" 
          value={stats.cities} 
          icon={<FaMapMarkerAlt className="text-indigo-500" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Users by Month */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Inscriptions par Mois
          </h2>
          <div className="h-80">
            <Bar
              options={chartOptions('Inscriptions par Mois')}
              data={{
                labels: chartData.usersByMonth.labels,
                datasets: [{
                  label: 'Utilisateurs',
                  data: chartData.usersByMonth.data,
                  backgroundColor: 'rgba(54, 162, 235, 0.7)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1
                }]
              }}
            />
          </div>
        </div>

        {/* Artisans by Category */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Artisans par Catégorie
          </h2>
          <div className="h-80">
            <Pie
              options={chartOptions('Artisans par Catégorie')}
              data={{
                labels: chartData.artisansByCategory.labels,
                datasets: [{
                  data: chartData.artisansByCategory.data,
                  backgroundColor:chartData.artisansByCategory.backgroundColors,
                  borderWidth: 1
                }]
              }}
            />
          </div>
        </div>

        {/* Artisans by City */}
        {/* Artisans par Ville - Version avec villes fixes et gestion des données manquantes */}
<div className="lg:col-span-2">
  <div className="p-6 bg-white rounded-xl shadow-sm">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Répartition des Artisans par Ville au Maroc</h2>
        <p className="text-sm text-gray-500">Distribution géographique des artisans inscrits</p>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center px-3 py-1 bg-indigo-50 rounded-full">
          <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
          <span className="text-xs font-medium text-indigo-700">
            {((chartData.artisansByCity?.labels || []).filter(Boolean).length)} villes actives
          </span>
        </div>
      </div>
    </div>

    {/* Graphique avec villes fixes du Maroc */}
    <div className="h-[30rem] -mx-2">
      <Bar
        data={{
          labels: [
            'Casablanca', 'Rabat', 'Fès', 'Marrakech', 
            'Agadir', 'Oujda',
            'Kénitra', 'Tétouan', 'Safi', 'Mohammedia','Tanger', 'Meknès',
            'El Jadida', 'Béni Mellal', 'Nador', 'Témara',
            'Khouribga', 'Settat', 'Larache', 'Berrechid'
          ],
          datasets: [{
            data: [
              'Casablanca', 'Rabat', 'Fès', 'Marrakech', 
              'Agadir', 'Oujda',
              'Kénitra', 'Tétouan', 'Safi', 'Mohammedia','Tanger', 'Meknès',
              'El Jadida', 'Béni Mellal', 'Nador', 'Témara',
              'Khouribga', 'Settat', 'Larache', 'Berrechid'
            ].map(city => {
              // Trouve l'index de la ville dans les données du backend
              const index = (chartData.artisansByCity?.labels || []).indexOf(city);
              return index !== -1 ? chartData.artisansByCity.data[index] : 0;
            }),
            backgroundColor: (context) => {
              const value = context.raw;
              if (value === 0) return 'rgba(229, 231, 235, 0.5)'; // Gris clair pour villes vides
              const max = Math.max(...chartData.artisansByCity?.data || [1]);
              const ratio = value / max;
              return `rgba(79, 70, 229, ${0.2 + ratio * 0.6})`;
            },
            borderColor: (context) => {
              return context.raw === 0 
                ? 'rgba(209, 213, 219, 0.5)' 
                : 'rgba(79, 70, 229, 0.8)';
            },
            borderWidth: 1.5,
            borderRadius: 4,
            borderSkipped: false,
            hoverBackgroundColor: (context) => {
              return context.raw === 0
                ? 'rgba(229, 231, 235, 0.7)'
                : 'rgba(79, 70, 229, 0.9)';
            },
          }]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              titleColor: '#111827',
              bodyColor: '#374151',
              borderColor: '#e5e7eb',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 8,
              displayColors: false,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              callbacks: {
                label: (context) => {
                  return context.raw === 0 
                    ? 'Aucun artisan enregistré' 
                    : `${context.raw} artisan${context.raw > 1 ? 's' : ''}`;
                },
                title: (items) => `Ville: ${items[0].label}`
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(229, 231, 235, 0.5)',
                drawBorder: false,
              },
              ticks: {
                padding: 8,
                color: '#6b7280',
                font: { 
                  family: 'Inter, sans-serif',
                  size: 12
                },
                callback: function(value) {
                  if (value % 1 === 0) {
                    return value;
                  }
                },
                stepSize: () => {
                  const maxValue = Math.max(...(chartData.artisansByCity?.data || [0]));
                  if (maxValue <= 10) return 1;
                  if (maxValue <= 50) return 5;
                  if (maxValue <= 200) return 20;
                  return Math.ceil(maxValue / 10);
                }
              },
            },
            x: {
              grid: { display: false },
              ticks: {
                color: '#6b7280',
                font: { 
                  family: 'Inter, sans-serif',
                  size: 11,
                  weight: '500'
                },
                maxRotation: 45,
                minRotation: 45,
              },
            },
          },
          interaction: {
            intersect: false,
            mode: 'index',
          }
        }}
      />
    </div>

    {/* Légende et informations */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 mt-4 border-t border-gray-100 gap-4">
      <div className="flex items-center text-sm text-gray-600">
        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
        </svg>
        <div>
          <p>Total artisans: <span className="font-medium text-gray-800">
            {(chartData.artisansByCity?.data || []).reduce((a, b) => a + b, 0)}
          </span></p>
          <p className="text-xs text-gray-500 mt-1">Les villes grises n'ont pas encore d'artisans enregistrés</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center text-xs">
          <span className="w-3 h-3 bg-indigo-500 rounded mr-1"></span>
          <span>Villes actives</span>
        </div>
        <div className="flex items-center text-xs">
          <span className="w-3 h-3 bg-gray-200 rounded mr-1"></span>
          <span>Villes disponibles</span>
        </div>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default AdminDashboard;