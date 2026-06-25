'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  fetchDirectoryCategoriesStart,
  addDirectoryCategoryStart,
  updateDirectoryCategoryStart,
  deleteDirectoryCategoryStart,
} from '@/store/directory/directory.slice';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DirectoryCategory } from '@/types/directoryCategory';

const initialFormData = {
  name: '',
  slug: '',
  description: '',
  icon: '',
  iconFamily: '',
  color: '',
  sortOrder: 100,
};

export default function DirectoryCategoriesPage() {
  const dispatch = useDispatch();
  const { categories, loading, submitting, error } = useSelector(
    (state: RootState) => state.directory
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<DirectoryCategory | null>(null);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    dispatch(fetchDirectoryCategoriesStart());
  }, [dispatch]);

  const handleOpenDialog = (category: DirectoryCategory | null = null) => {
    if (category) {
      setIsEditing(true);
      setCurrentCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        icon: category.icon || '',
        iconFamily: category.iconFamily || '',
        color: category.color || '',
        sortOrder: category.sortOrder || 100,
      });
    } else {
      setIsEditing(false);
      setCurrentCategory(null);
      setFormData(initialFormData);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      ...formData,
      sortOrder: Number(formData.sortOrder),
    };
    if (isEditing && currentCategory) {
      dispatch(
        updateDirectoryCategoryStart({
          id: currentCategory.id,
          payload,
        })
      );
    } else {
      dispatch(addDirectoryCategoryStart(payload));
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    dispatch(deleteDirectoryCategoryStart(id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Directory Categories</h1>
        <Button onClick={() => handleOpenDialog()}>Create Category</Button>
      </div>

      {loading && <p>Loading categories...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell>{cat.slug}</TableCell>
                  <TableCell>
                    <Badge variant={cat.isActive ? 'default' : 'destructive'}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenDialog(cat)}>
                      Edit
                    </Button>
                    {cat.isActive && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will deactivate the category (soft delete). It will no longer be available for new listings.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(cat.id)}>
                              Deactivate
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Directory Category' : 'Create Directory Category'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" required /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="slug" className="text-right">Slug</Label><Input id="slug" name="slug" value={formData.slug} onChange={handleChange} className="col-span-3" required disabled={isEditing} /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="description" className="text-right">Description</Label><Input id="description" name="description" value={formData.description} onChange={handleChange} className="col-span-3" /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="icon" className="text-right">Icon</Label><Input id="icon" name="icon" value={formData.icon} onChange={handleChange} className="col-span-3" /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="color" className="text-right">Color</Label><Input id="color" name="color" value={formData.color} onChange={handleChange} className="col-span-3" placeholder="#B86B00" /></div>
              <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="sortOrder" className="text-right">Sort Order</Label><Input id="sortOrder" name="sortOrder" type="number" value={formData.sortOrder} onChange={handleChange} className="col-span-3" /></div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
              <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}