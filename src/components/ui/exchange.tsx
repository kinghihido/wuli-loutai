'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Coins,
  Gift,
  Sparkles,
  Check,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoucherType } from '@/components/ui/voucher';

interface ExchangeProps {
  coins: number;
  onExchange: (type: VoucherType, cost: number) => void;
}

// 券兑换配置
const exchangeConfig: Record<VoucherType, { 
  name: string; 
  icon: string; 
  description: string;
  price: number;
  gradient: string;
}> = {
  xiaoshuo: { 
    name: '骁朔定向券', 
    icon: '📖', 
    description: '开卷有益，知识无价',
    price: 500,
    gradient: 'from-slate-400 to-gray-300'
  },
  guansai: { 
    name: '观赛定向券', 
    icon: '⚽', 
    description: '足球不老，竞技永恒',
    price: 750,
    gradient: 'from-orange-400 to-amber-300'
  },
  dongge: { 
    name: '冬戈定向券', 
    icon: '🦌', 
    description: '冬戈之鹿，奔跑炸裂',
    price: 1500,
    gradient: 'from-amber-500 to-yellow-400'
  },
  zixuan: { 
    name: '自选券', 
    icon: '🎁', 
    description: '自由选择心仪的定向券',
    price: 2000,
    gradient: 'from-purple-500 to-pink-400'
  },
};

export function Exchange({ coins, onExchange }: ExchangeProps) {
  const [selectedType, setSelectedType] = useState<VoucherType | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [exchangeSuccess, setExchangeSuccess] = useState(false);

  const handleSelectVoucher = (type: VoucherType) => {
    setSelectedType(type);
    setShowConfirm(true);
    setExchangeSuccess(false);
  };

  const handleConfirm = () => {
    if (selectedType) {
      const config = exchangeConfig[selectedType];
      if (coins >= config.price) {
        onExchange(selectedType, config.price);
        setExchangeSuccess(true);
        setTimeout(() => {
          setShowConfirm(false);
          setExchangeSuccess(false);
        }, 1500);
      }
    }
  };

  const handleClose = () => {
    setShowConfirm(false);
    setExchangeSuccess(false);
  };

  // 按价格排序
  const sortedTypes = Object.entries(exchangeConfig)
    .sort((a, b) => a[1].price - b[1].price) as [VoucherType, typeof exchangeConfig[VoucherType]][];

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          兑换所
        </h3>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg border border-amber-200">
          <Coins className="w-5 h-5 text-amber-600" />
          <span className="font-semibold text-amber-700">{coins}</span>
          <span className="text-sm text-amber-600">代币</span>
        </div>
      </div>

      {/* 兑换说明 */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
        <div className="flex items-center gap-2 text-sm text-purple-700">
          <Sparkles className="w-4 h-4" />
          <span>使用代币兑换定向券，每种券都有独特的使用效果</span>
        </div>
      </div>

      {/* 券兑换卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedTypes.map(([type, config]) => {
          const canAfford = coins >= config.price;
          
          return (
            <div
              key={type}
              className={cn(
                'relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer',
                canAfford 
                  ? 'border-transparent hover:border-primary/50 hover:shadow-lg' 
                  : 'border-transparent opacity-60 cursor-not-allowed'
              )}
              onClick={() => canAfford && handleSelectVoucher(type)}
            >
              {/* 背景渐变 */}
              <div className={cn(
                'absolute inset-0 bg-gradient-to-br opacity-20',
                config.gradient
              )} />
              
              <div className="relative p-4 bg-card/80 backdrop-blur">
                {/* 图标 */}
                <div className="text-4xl mb-3 text-center">{config.icon}</div>
                
                {/* 名称 */}
                <h4 className="font-semibold text-center mb-1">{config.name}</h4>
                
                {/* 描述 */}
                <p className="text-xs text-muted-foreground text-center mb-3 line-clamp-1">
                  {config.description}
                </p>
                
                {/* 价格 */}
                <div className={cn(
                  'flex items-center justify-center gap-1 py-2 px-3 rounded-lg',
                  canAfford 
                    ? 'bg-gradient-to-r from-amber-100 to-yellow-100' 
                    : 'bg-muted'
                )}>
                  <Coins className={cn(
                    'w-4 h-4',
                    canAfford ? 'text-amber-600' : 'text-muted-foreground'
                  )} />
                  <span className={cn(
                    'font-bold',
                    canAfford ? 'text-amber-700' : 'text-muted-foreground'
                  )}>
                    {config.price}
                  </span>
                </div>
                
                {/* 不可兑换标记 */}
                {!canAfford && (
                  <div className="absolute top-2 right-2">
                    <AlertCircle className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 兑换确认弹窗 */}
      <Dialog open={showConfirm} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {exchangeSuccess ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  兑换成功
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5 text-primary" />
                  确认兑换
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {exchangeSuccess 
                ? '定向券已添加到您的券包' 
                : '确定要使用代币兑换此定向券吗？'
              }
            </DialogDescription>
          </DialogHeader>

          {selectedType && !exchangeSuccess && (
            <div className="py-4">
              <div className={cn(
                'p-4 rounded-lg bg-gradient-to-br mb-4',
                exchangeConfig[selectedType].gradient
              )}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{exchangeConfig[selectedType].icon}</span>
                  <div>
                    <div className="font-bold text-lg">{exchangeConfig[selectedType].name}</div>
                    <div className="text-sm opacity-80">{exchangeConfig[selectedType].description}</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-600" />
                  <span>消耗代币</span>
                </div>
                <span className="font-bold text-amber-600">-{exchangeConfig[selectedType].price}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 mt-2">
                <span className="text-muted-foreground">兑换后余额</span>
                <span className="font-bold text-green-600">
                  {coins - exchangeConfig[selectedType].price}
                </span>
              </div>
            </div>
          )}

          {exchangeSuccess && (
            <div className="py-8 text-center">
              <div className="text-6xl mb-4">{exchangeConfig[selectedType!].icon}</div>
              <div className="text-lg font-semibold text-green-600">兑换成功！</div>
            </div>
          )}

          <DialogFooter>
            {!exchangeSuccess && (
              <>
                <Button variant="outline" onClick={handleClose}>
                  取消
                </Button>
                <Button onClick={handleConfirm} className="gap-1">
                  <Sparkles className="w-4 h-4" />
                  确认兑换
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Exchange;
