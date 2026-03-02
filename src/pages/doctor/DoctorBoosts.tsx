import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DoctorLayout from '@/components/DoctorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Zap, TrendingUp, Star, Eye, ShoppingCart, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AvailableBoost {
  id: string;
  type: string;
  xpPoints: number;
  description: string;
  purchased: boolean;
  active: boolean;
}

const boostIcons: Record<string, typeof Zap> = {
  profile_completion: Star,
  top_search: TrendingUp,
  featured: Eye,
  priority: Zap,
};

const initialBoosts: AvailableBoost[] = [
  { id: '1', type: 'profile_completion', xpPoints: 50, description: '', purchased: true, active: true },
  { id: '2', type: 'top_search', xpPoints: 100, description: '', purchased: false, active: false },
  { id: '3', type: 'featured', xpPoints: 200, description: '', purchased: false, active: false },
  { id: '4', type: 'priority', xpPoints: 150, description: '', purchased: true, active: false },
];

const DoctorBoosts = () => {
  const { t } = useTranslation();
  const [boosts, setBoosts] = useState<AvailableBoost[]>(initialBoosts);

  const totalXP = boosts.filter(b => b.purchased && b.active).reduce((sum, b) => sum + b.xpPoints, 0);
  const purchasedCount = boosts.filter(b => b.purchased).length;

  const handlePurchase = (id: string) => {
    setBoosts(prev => prev.map(b => b.id === id ? { ...b, purchased: true, active: true } : b));
    toast({ title: t('doctor.boosts.purchased') });
  };

  const toggleActive = (id: string) => {
    setBoosts(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  return (
    <DoctorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t('doctor.boosts.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('doctor.boosts.subtitle')}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10"><Zap className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('doctor.boosts.active_xp')}</p>
                  <p className="text-2xl font-bold">{totalXP} XP</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10"><Check className="h-5 w-5 text-green-500" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('doctor.boosts.purchased_count')}</p>
                  <p className="text-2xl font-bold">{purchasedCount}/{boosts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10"><TrendingUp className="h-5 w-5 text-amber-500" /></div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('doctor.boosts.ranking_boost')}</p>
                  <p className="text-2xl font-bold">+{totalXP}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Boost cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {boosts.map(boost => {
            const Icon = boostIcons[boost.type] || Zap;
            return (
              <Card key={boost.id} className={!boost.purchased ? 'border-dashed' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{t(`admin.boosts.types.${boost.type}`)}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {t(`doctor.boosts.desc.${boost.type}`)}
                        </p>
                        <Badge variant="secondary" className="mt-2">{boost.xpPoints} XP</Badge>
                      </div>
                    </div>
                    <div>
                      {boost.purchased ? (
                        <Switch checked={boost.active} onCheckedChange={() => toggleActive(boost.id)} />
                      ) : (
                        <Button size="sm" className="gap-1.5" onClick={() => handlePurchase(boost.id)}>
                          <ShoppingCart className="h-3.5 w-3.5" />
                          {t('doctor.boosts.add_boost')}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">{t('doctor.boosts.how_it_works')}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t('doctor.boosts.how_desc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
};

export default DoctorBoosts;
