import { useTranslation } from 'react-i18next';
import { Users, CalendarCheck, Stethoscope, TrendingUp, UserPlus, Star, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const statCards = [
  { key: 'total_users', icon: Users, value: '12,458', change: '+12%', color: 'text-primary' },
  { key: 'total_doctors', icon: Stethoscope, value: '5,230', change: '+8%', color: 'text-emerald-500' },
  { key: 'appointments', icon: CalendarCheck, value: '48,392', change: '+23%', color: 'text-amber-500' },
  { key: 'revenue', icon: DollarSign, value: '€124,500', change: '+18%', color: 'text-violet-500' },
];

const monthlyData = [
  { month: 'Sep', users: 820, appointments: 3200, revenue: 8500 },
  { month: 'Oct', users: 950, appointments: 3800, revenue: 9200 },
  { month: 'Nov', users: 1100, appointments: 4100, revenue: 10800 },
  { month: 'Dec', users: 1250, appointments: 4500, revenue: 12000 },
  { month: 'Jan', users: 1400, appointments: 5200, revenue: 14500 },
  { month: 'Fév', users: 1580, appointments: 5800, revenue: 16200 },
];

const specialtyDistribution = [
  { name: 'Généraliste', value: 1240, color: 'hsl(var(--primary))' },
  { name: 'Dentiste', value: 890, color: 'hsl(142 71% 45%)' },
  { name: 'Cardiologue', value: 340, color: 'hsl(45 93% 47%)' },
  { name: 'Dermatologue', value: 520, color: 'hsl(262 83% 58%)' },
  { name: 'Autre', value: 2240, color: 'hsl(var(--muted-foreground))' },
];

const recentActivity = [
  { id: 1, type: 'new_doctor', name: 'Dr. Karim Mesli', time: 'Il y a 5 min', icon: UserPlus },
  { id: 2, type: 'new_review', name: 'Sara Alaoui → Dr. Benali', time: 'Il y a 12 min', icon: Star },
  { id: 3, type: 'appointment', name: 'Fatima Z. → Dr. Idrissi', time: 'Il y a 25 min', icon: CalendarCheck },
  { id: 4, type: 'new_user', name: 'Mohamed Hadj', time: 'Il y a 1h', icon: UserPlus },
  { id: 5, type: 'payment', name: 'Paiement reçu - 2,500 DZD', time: 'Il y a 2h', icon: DollarSign },
];

const topDoctors = [
  { name: 'Dr. Ahmed Benali', specialty: 'Cardiologue', rating: 4.9, appointments: 342 },
  { name: 'Dr. Omar Idrissi', specialty: 'Dentiste', rating: 4.8, appointments: 298 },
  { name: 'Dr. Amina Khelifi', specialty: 'Dermatologue', rating: 4.7, appointments: 275 },
];

const AdminDashboard = () => {
  const { t } = useTranslation();

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.dashboard_title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('admin.dashboard_subtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.key} className="border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t(`admin.stats.${stat.key}`)}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-emerald-600 mt-1">{stat.change} {t('admin.stats.from_last_month')}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User growth + appointments chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                {t('admin.dashboard_charts.user_growth')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Utilisateurs" />
                  <Bar dataKey="appointments" fill="hsl(142 71% 45%)" radius={[4, 4, 0, 0]} name="RDV" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                {t('admin.dashboard_charts.revenue')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(142 71% 45%)" strokeWidth={2} dot={{ r: 4 }} name="Revenus (€)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              {t('admin.dashboard_charts.monthly_comparison')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: t('admin.monthly.new_users'), current: 1580, previous: 1400, icon: UserPlus },
                { label: t('admin.monthly.new_doctors'), current: 320, previous: 280, icon: Stethoscope },
                { label: t('admin.monthly.appointments'), current: 5800, previous: 5200, icon: CalendarCheck },
                { label: t('admin.monthly.revenue'), current: 16200, previous: 14500, icon: DollarSign },
              ].map((item, i) => {
                const change = ((item.current - item.previous) / item.previous * 100).toFixed(1);
                const isPositive = item.current >= item.previous;
                return (
                  <div key={i} className="p-3 rounded-xl bg-accent/30">
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                    <p className="text-lg font-bold">{item.current.toLocaleString()}</p>
                    <div className={`flex items-center gap-1 text-xs mt-1 ${isPositive ? 'text-emerald-600' : 'text-destructive'}`}>
                      {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {change}%
                    </div>
                  </div>
                );
              })}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2} name="Utilisateurs" />
                <Area type="monotone" dataKey="appointments" stroke="hsl(142 71% 45%)" fill="hsl(142 71% 45% / 0.1)" strokeWidth={2} name="RDV" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Specialty distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('admin.dashboard_charts.specialty_dist')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={specialtyDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {specialtyDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2">
                {specialtyDistribution.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top doctors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('admin.dashboard_charts.top_doctors')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topDoctors.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-accent/30">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.specialty}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{doc.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{doc.appointments} RDV</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('admin.recent_activity')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <activity.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
