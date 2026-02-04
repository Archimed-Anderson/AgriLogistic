import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { TaskManagement } from '@/app/components/TaskManagement';
import { LaborManagement } from '@/app/components/LaborManagement';

export default function CombinedTasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Opérations</h1>
        <p className="text-gray-500">Gestion unifiée des tâches et de la main d'œuvre</p>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 w-auto inline-flex">
          <TabsTrigger
            value="tasks"
            className="px-6 py-2 rounded-lg data-[state=active]:bg-[#0B7A4B] data-[state=active]:text-white transition-all"
          >
            Tâches
          </TabsTrigger>
          <TabsTrigger
            value="labor"
            className="px-6 py-2 rounded-lg data-[state=active]:bg-[#0B7A4B] data-[state=active]:text-white transition-all"
          >
            Main d'œuvre
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-6">
          <TaskManagement />
        </TabsContent>

        <TabsContent value="labor" className="mt-6">
          <LaborManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
