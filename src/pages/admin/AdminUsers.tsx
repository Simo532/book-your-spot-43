import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MoreHorizontal, Shield, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/components/AdminLayout';

const mockUsers = [
  { id: '1', name: 'Ahmed Benali', email: 'ahmed@email.com', role: 'doctor', status: 'active', joined: '2025-12-01' },
  { id: '2', name: 'Sara Alaoui', email: 'sara@email.com', role: 'patient', status: 'active', joined: '2025-11-15' },
  { id: '3', name: 'Youssef Kabir', email: 'youssef@email.com', role: 'doctor', status: 'suspended', joined: '2025-10-20' },
  { id: '4', name: 'Fatima Zahra', email: 'fatima@email.com', role: 'patient', status: 'active', joined: '2026-01-05' },
  { id: '5', name: 'Omar Idrissi', email: 'omar@email.com', role: 'doctor', status: 'active', joined: '2026-02-10' },
];

const AdminUsers = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = mockUsers.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.users.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('admin.users.subtitle')}</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('admin.users.search_placeholder')}
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
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
                      <Badge variant={user.role === 'doctor' ? 'default' : 'secondary'} className="capitalize">
                        {user.role === 'doctor' ? t('auth.role_doctor') : t('auth.role_patient')}
                      </Badge>
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
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Shield className="h-4 w-4" /> {t('admin.users.make_admin')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            {user.status === 'active' ? (
                              <><UserX className="h-4 w-4" /> {t('admin.users.suspend')}</>
                            ) : (
                              <><UserCheck className="h-4 w-4" /> {t('admin.users.activate')}</>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
