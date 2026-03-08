import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DoctorLayout from '@/components/DoctorLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Zap, TrendingUp, Check, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AvailableBoost {
  id: string;
  name: string;
  xpAmount: number;
  durationDays: number;
  price: number;
  description: string;
  purchased: boolean;
  active: boolean;
}

const initialBoosts: AvailableBoost[] = [
  { id: '1', name: 'BOOST_3_DAYS', xpAmount: 50, durationDays: 3, price: 29.99, description: 'Short visibility boost', purchased: true, active: true },
  { id: '2', name: 'BOOST_7_DAYS', xpAmount: 100, durationDays: 7, price: 49.99, description: 'Weekly ranking improvement', purchased: false, active: false },
  { id: '3', name: 'BOOST_14_DAYS', xpAmount: 200, durationDays: 14, price: 79.99, description: 'Premium two-week boost', purchased: false, active: false },
  { id: '4', name: 'BOOST_30_DAYS', xpAmount: 500, durationDays: 30, price: 129.99, description: 'Maximum monthly visibility', purchased: true, active: false },
];

const DoctorBoosts = () => {
  const { t } = useTranslation();
  const [boosts, setBoosts] = useState<AvailableBoost[]>(initialBoosts);

  const totalXP = boosts.filter(b => b.purchased && b.active).reduce((sum, b) => sum + b.xpAmount, 0);
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
                <div className="p-2 rounded-lg bg-primary/10"><Check className="h-5 w-5 text-primary" /></div>
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
                <div className="p-2 rounded-lg bg-primary/10"><TrendingUp className="h-5 w-5 text-primary" /></div>
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
          {boosts.map(boost => (
            <Card key={boost.id} className={!boost.purchased ? 'border-dashed' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{boost.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{boost.description}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="secondary">{boost.xpAmount} XP</Badge>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {boost.durationDays} {t('admin.boosts.days')}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <DollarSign className="h-3 w-3" />
                          {boost.price.toFixed(2)}
                        </Badge>
                      </div>
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
          ))}
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
