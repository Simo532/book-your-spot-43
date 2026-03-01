import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MoreHorizontal, Shield, UserCheck, UserX, Plus, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AdminLayout from '@/components/AdminLayout';
import DoctorOnboardingForm from '@/components/onboarding/DoctorOnboardingForm';
import PatientOnboardingForm from '@/components/onboarding/PatientOnboardingForm';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  status: 'active' | 'suspended';
  joined: string;
  phone?: string;
}

const initialUsers: User[] = [
  { id: '1', name: 'Ahmed Benali', email: 'ahmed@email.com', role: 'doctor', status: 'active', joined: '2025-12-01', phone: '+213 555 0001' },
  { id: '2', name: 'Sara Alaoui', email: 'sara@email.com', role: 'patient', status: 'active', joined: '2025-11-15', phone: '+213 555 0002' },
  { id: '3', name: 'Youssef Kabir', email: 'youssef@email.com', role: 'doctor', status: 'suspended', joined: '2025-10-20', phone: '+213 555 0003' },
  { id: '4', name: 'Fatima Zahra', email: 'fatima@email.com', role: 'patient', status: 'active', joined: '2026-01-05', phone: '+213 555 0004' },
  { id: '5', name: 'Omar Idrissi', email: 'omar@email.com', role: 'doctor', status: 'active', joined: '2026-02-10', phone: '+213 555 0005' },
  { id: '6', name: 'Admin Principal', email: 'admin@superdoc.com', role: 'admin', status: 'active', joined: '2025-01-01', phone: '+213 555 0000' },
];

const isSuperAdmin = true;

const AdminUsers = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  // Create user dialog
  const [createOpen, setCreateOpen] = useState(false);
  const [createRole, setCreateRole] = useState<'patient' | 'doctor'>('patient');
  const [roleSelectStep, setRoleSelectStep] = useState(true);

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openCreate = () => {
    setRoleSelectStep(true);
    setCreateRole('patient');
    setCreateOpen(true);
  };

  const handleCreateComplete = (data: any) => {
    setUsers(prev => [...prev, {
      id: `u${Date.now()}`,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      role: createRole,
      status: 'active',
      joined: new Date().toISOString().split('T')[0],
    }]);
    setCreateOpen(false);
  };

  const handleDelete = () => {
    if (!deleteUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
    setDeleteUser(null);
  };

  const toggleStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  const promoteAdmin = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, role: 'admin' } : u));
  };

  const roleLabel = (role: string) => {
    if (role === 'doctor') return t('auth.role_doctor');
    if (role === 'patient') return t('auth.role_patient');
    return 'Admin';
  };

  const roleVariant = (role: string): 'default' | 'secondary' | 'destructive' => {
    if (role === 'doctor') return 'default';
    if (role === 'admin') return 'destructive';
    return 'secondary';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('admin.users.title')}</h1>
            <p className="text-muted-foreground text-sm mt-1">{t('admin.users.subtitle')}</p>
          </div>
          <Button className="gap-2" onClick={openCreate}>
            <Plus className="h-4 w-4" /> {t('admin.users.add_user')}
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder={t('admin.users.search_placeholder')} className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.users.all_roles')}</SelectItem>
                  <SelectItem value="patient">{t('auth.role_patient')}</SelectItem>
                  <SelectItem value="doctor">{t('auth.role_doctor')}</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.users.name')}</TableHead>
                  <TableHead>{t('admin.users.email')}</TableHead>
                  <TableHead>{t('admin.users.role')}</TableHead>
                  <TableHead>{t('admin.users.status')}</TableHead>
                  <TableHead>{t('admin.users.joined')}</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={roleVariant(user.role)} className="capitalize">{roleLabel(user.role)}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.status === 'active' ? 'text-green-600' : 'text-destructive'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-destructive'}`} />
                        {user.status === 'active' ? t('admin.users.active') : t('admin.users.suspended')}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.joined}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.role !== 'admin' && (
                            <DropdownMenuItem className="gap-2" onClick={() => promoteAdmin(user.id)}>
                              <Shield className="h-4 w-4" /> {t('admin.users.make_admin')}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="gap-2" onClick={() => toggleStatus(user.id)}>
                            {user.status === 'active' ? (
                              <><UserX className="h-4 w-4" /> {t('admin.users.suspend')}</>
                            ) : (
                              <><UserCheck className="h-4 w-4" /> {t('admin.users.activate')}</>
                            )}
                          </DropdownMenuItem>
                          {(isSuperAdmin || user.role !== 'admin') && (
                            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive" onClick={() => setDeleteUser(user)}>
                              <Trash2 className="h-4 w-4" /> {t('admin.delete')}
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create user dialog with multi-step form */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t('admin.users.add_user')}</DialogTitle>
            </DialogHeader>
            {roleSelectStep ? (
              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">{t('admin.users.select_role_first')}</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setCreateRole('patient')}
                    className={`p-6 rounded-xl border-2 text-center transition-all ${
                      createRole === 'patient' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <span className="text-3xl mb-2 block">🩺</span>
                    <span className="font-medium">{t('auth.role_patient')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateRole('doctor')}
                    className={`p-6 rounded-xl border-2 text-center transition-all ${
                      createRole === 'doctor' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <span className="text-3xl mb-2 block">👨‍⚕️</span>
                    <span className="font-medium">{t('auth.role_doctor')}</span>
                  </button>
                </div>
                <Button className="w-full" onClick={() => setRoleSelectStep(false)}>
                  {t('onboarding.doctor.next')}
                </Button>
              </div>
            ) : (
              <div className="py-2">
                {createRole === 'doctor' ? (
                  <DoctorOnboardingForm showPassword compact onComplete={handleCreateComplete} />
                ) : (
                  <PatientOnboardingForm showPassword compact onComplete={handleCreateComplete} />
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete confirmation */}
        <AlertDialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('admin.users.confirm_delete')}</AlertDialogTitle>
              <AlertDialogDescription>{t('admin.users.confirm_delete_desc', { name: deleteUser?.name })}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t('admin.delete')}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
