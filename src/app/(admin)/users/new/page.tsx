import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserForm } from '@/presentation/components/admin/users/UserForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/users">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Nouvel Utilisateur
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Créer un nouveau compte utilisateur
          </p>
        </div>
      </div>
      
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm />
        </CardContent>
      </Card>
    </div>
  );
}
