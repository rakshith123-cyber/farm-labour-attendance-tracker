import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { UserPlus, Edit, Trash2, Phone, IndianRupee } from 'lucide-react';
import { useWorkers } from '../hooks/useWorkers';
import WorkerFormDialog from '../components/WorkerFormDialog';
import type { Worker } from '../backend';
import { toast } from 'sonner';

export default function WorkersPage() {
  const { workers, isLoading, deleteWorker } = useWorkers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [deletingWorker, setDeletingWorker] = useState<Worker | null>(null);

  const handleDelete = async () => {
    if (!deletingWorker) return;
    try {
      await deleteWorker(deletingWorker.id);
      toast.success('Worker deleted successfully');
      setDeletingWorker(null);
    } catch (error) {
      toast.error('Failed to delete worker');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Workers List</h1>
          <p className="text-lg text-muted-foreground">Manage your farm workers</p>
        </div>
        <Button size="lg" onClick={() => setIsAddDialogOpen(true)} className="text-lg min-h-[48px] w-full sm:w-auto">
          <UserPlus className="mr-2 h-5 w-5" />
          Add New Worker
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-muted-foreground">Loading workers...</p>
          </CardContent>
        </Card>
      ) : workers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <img src="/assets/generated/worker-icon.dim_256x256.png" alt="" className="h-24 w-24 mx-auto mb-4 opacity-50" />
            <p className="text-xl text-muted-foreground mb-4">No workers added yet</p>
            <Button size="lg" onClick={() => setIsAddDialogOpen(true)} className="text-lg min-h-[48px]">
              <UserPlus className="mr-2 h-5 w-5" />
              Add Your First Worker
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">All Workers ({workers.length})</CardTitle>
            <CardDescription className="text-base">Click edit to update worker details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base font-semibold">Name</TableHead>
                    <TableHead className="text-base font-semibold">Phone</TableHead>
                    <TableHead className="text-base font-semibold">Daily Wage</TableHead>
                    <TableHead className="text-base font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.map((worker) => (
                    <TableRow key={worker.id.toString()}>
                      <TableCell className="font-medium text-base">{worker.name}</TableCell>
                      <TableCell className="text-base">
                        {worker.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {worker.phone}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-base">
                        <div className="flex items-center gap-1 font-semibold">
                          <IndianRupee className="h-4 w-4" />
                          {worker.dailyWageRupees.toString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="default"
                            onClick={() => setEditingWorker(worker)}
                            className="min-h-[44px]"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="default"
                            onClick={() => setDeletingWorker(worker)}
                            className="min-h-[44px]"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <WorkerFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        worker={null}
      />

      <WorkerFormDialog
        open={!!editingWorker}
        onOpenChange={(open) => !open && setEditingWorker(null)}
        worker={editingWorker}
      />

      <AlertDialog open={!!deletingWorker} onOpenChange={(open) => !open && setDeletingWorker(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Delete Worker?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete <strong>{deletingWorker?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-base min-h-[44px]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="text-base min-h-[44px] bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
