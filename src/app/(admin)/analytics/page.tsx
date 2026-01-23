import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Statistiques et rapports détaillés
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">DAU</p>
            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">8,234</p>
            <p className="text-sm text-green-600 mt-2">+5% ↗</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">MAU</p>
            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">45,678</p>
            <p className="text-sm text-green-600 mt-2">+12% ↗</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Conversion</p>
            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">3.2%</p>
            <p className="text-sm text-green-600 mt-2">+0.3% ↗</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">AOV</p>
            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">67.50€</p>
            <p className="text-sm text-green-600 mt-2">+2% ↗</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs Actifs (30 jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Graphique à implémenter (Recharts)
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenus par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
              Graphique à implémenter (Recharts)
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Produits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Tomates', count: 1234 },
                { name: 'Carottes', count: 987 },
                { name: 'Pommes', count: 856 },
                { name: 'Salades', count: 743 },
                { name: 'Oignons', count: 621 },
              ].map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                      {index + 1}.
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Revenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { category: 'Légumes', percentage: 45, color: 'bg-blue-600' },
                { category: 'Fruits', percentage: 30, color: 'bg-green-600' },
                { category: 'Céréales', percentage: 25, color: 'bg-yellow-600' },
              ].map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.category}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full`} 
                      style={{ width: `${item.percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
