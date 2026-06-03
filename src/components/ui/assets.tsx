'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Voucher, VoucherCard, VoucherUseAnimation, VoucherType } from '@/components/ui/voucher';
import { Exchange } from '@/components/ui/exchange';
import {
  Wallet,
  Sparkles,
  History,
  Filter,
  Grid,
  List,
  Gift,
  Clock,
  TrendingUp,
  Settings,
  Minus,
  Plus,
  Coins,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetsProps {
  vouchers: Voucher[];
  onUseVoucher: (voucher: Voucher) => void;
  onConvertVoucher?: (voucherId: string, newType: VoucherType) => void;
  usedHistory: { voucher: Voucher; usedAt: string }[];
  donggeUsedCount: number;
  onUpdateDonggeUsedCount?: (count: number) => void;
  coins?: number;
  onExchange?: (type: VoucherType, cost: number) => void;
}

// 券类型配置
const voucherTypeConfig: Record<VoucherType, { name: string; icon: string; gradient: string }> = {
  dongge: { name: '冬戈定向券', icon: '🦌', gradient: 'from-amber-400 to-yellow-300' },
  xiaoshuo: { name: '骁朔定向券', icon: '📖', gradient: 'from-slate-300 to-gray-200' },
  guansai: { name: '观赛定向券', icon: '⚽', gradient: 'from-orange-300 to-amber-200' },
  zixuan: { name: '自选券', icon: '🎁', gradient: 'from-purple-400 to-pink-300' },
};

// 计算今年已经过去的天数
function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function Assets({ 
  vouchers, 
  onUseVoucher, 
  onConvertVoucher, 
  usedHistory,
  donggeUsedCount,
  onUpdateDonggeUsedCount,
  coins = 0,
  onExchange,
}: AssetsProps) {
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [filter, setFilter] = useState<VoucherType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showDonggeModal, setShowDonggeModal] = useState(false);
  const [editDonggeCount, setEditDonggeCount] = useState(donggeUsedCount.toString());

  // 统计数据
  const stats = {
    total: vouchers.length,
    dongge: vouchers.filter(v => v.type === 'dongge').length,
    xiaoshuo: vouchers.filter(v => v.type === 'xiaoshuo').length,
    guansai: vouchers.filter(v => v.type === 'guansai').length,
    zixuan: vouchers.filter(v => v.type === 'zixuan').length,
  };

  // 计算冬戈率
  const dayOfYear = getDayOfYear();
  const donggeRate = donggeUsedCount > 0 ? (dayOfYear / donggeUsedCount).toFixed(2) : '∞';

  // 筛选后的券
  const filteredVouchers = filter === 'all' 
    ? vouchers 
    : vouchers.filter(v => v.type === filter);

  // 使用券
  const handleUse = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
  };

  // 转化自选券
  const handleConvert = (newType: VoucherType) => {
    if (selectedVoucher && onConvertVoucher) {
      onConvertVoucher(selectedVoucher.id, newType);
    }
  };

  // 完成使用动画
  const handleCompleteAnimation = () => {
    if (selectedVoucher && selectedVoucher.type !== 'zixuan') {
      onUseVoucher(selectedVoucher);
    }
    setSelectedVoucher(null);
  };

  // 更新冬戈券使用数
  const handleUpdateDonggeCount = () => {
    const newCount = parseInt(editDonggeCount) || 0;
    if (newCount < 0) {
      alert('使用数不能为负数');
      return;
    }
    onUpdateDonggeUsedCount?.(newCount);
    setShowDonggeModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          个人资产
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Gift className="w-3 h-3" />
            {stats.total} 张券
          </Badge>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <StatCard 
          label="代币余额" 
          value={coins} 
          icon={<Coins className="w-4 h-4" />}
          color="bg-amber-500/10 text-amber-600"
          highlight
        />
        <StatCard 
          label="总资产" 
          value={stats.total} 
          icon={<Wallet className="w-4 h-4" />}
          color="bg-primary/10 text-primary"
        />
        <StatCard 
          label="冬戈券" 
          value={stats.dongge} 
          icon={<span className="text-lg">🦌</span>}
          color="bg-amber-500/10 text-amber-600"
        />
        <StatCard 
          label="骁朔券" 
          value={stats.xiaoshuo} 
          icon={<span className="text-lg">📖</span>}
          color="bg-slate-400/10 text-slate-600"
        />
        <StatCard 
          label="观赛券" 
          value={stats.guansai} 
          icon={<span className="text-lg">⚽</span>}
          color="bg-orange-400/10 text-orange-600"
        />
        <StatCard 
          label="冬戈率" 
          value={donggeRate}
          subValue={`${dayOfYear}天 / ${donggeUsedCount}张`}
          icon={<TrendingUp className="w-4 h-4" />}
          color="bg-green-500/10 text-green-600"
          onClick={() => setShowDonggeModal(true)}
          showSettings
        />
      </div>

      {/* 标签页 */}
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory" className="gap-1">
            <Sparkles className="w-4 h-4" />
            我的券包
          </TabsTrigger>
          <TabsTrigger value="exchange" className="gap-1">
            <Gift className="w-4 h-4" />
            兑换所
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1">
            <History className="w-4 h-4" />
            使用记录
          </TabsTrigger>
        </TabsList>

        {/* 券包 */}
        <TabsContent value="inventory" className="mt-6">
          {/* 筛选和视图 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-1 flex-wrap">
                <FilterButton 
                  active={filter === 'all'} 
                  onClick={() => setFilter('all')}
                >
                  全部
                </FilterButton>
                {Object.entries(voucherTypeConfig).map(([key, config]) => (
                  <FilterButton 
                    key={key}
                    active={filter === key} 
                    onClick={() => setFilter(key as VoucherType)}
                    type={key as VoucherType}
                  >
                    {config.icon} {config.name.replace('定向券', '').replace('券', '')}
                  </FilterButton>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* 券列表 */}
          {filteredVouchers.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                {filteredVouchers.map(voucher => (
                  <VoucherCard
                    key={voucher.id}
                    voucher={voucher}
                    size="sm"
                    onClick={() => handleUse(voucher)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredVouchers.map(voucher => (
                  <VoucherListItem
                    key={voucher.id}
                    voucher={voucher}
                    onUse={() => handleUse(voucher)}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">
                {filter === 'all' ? '暂无定向券，完成任务获得奖励吧！' : '该类型暂无定向券'}
              </p>
            </div>
          )}
        </TabsContent>

        {/* 兑换所 */}
        <TabsContent value="exchange" className="mt-6">
          <Exchange 
            coins={coins} 
            onExchange={(type, cost) => onExchange?.(type, cost)}
          />
        </TabsContent>

        {/* 使用记录 */}
        <TabsContent value="history" className="mt-6">
          {usedHistory.length > 0 ? (
            <div className="space-y-3">
              {usedHistory.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/30"
                >
                  <VoucherCard voucher={item.voucher} size="sm" disabled />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.voucher.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.voucher.description}
                    </p>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {new Date(item.usedAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">暂无使用记录</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 冬戈率设置弹窗 */}
      <Dialog open={showDonggeModal} onOpenChange={setShowDonggeModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              冬戈率设置
            </DialogTitle>
            <DialogDescription>
              冬戈率 = 今年已过天数 ÷ 冬戈券使用数
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{donggeRate}</div>
              <div className="text-sm text-muted-foreground">
                {dayOfYear} 天 / {donggeUsedCount} 张
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">冬戈券使用数</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => {
                    const newCount = Math.max(0, donggeUsedCount - 1);
                    onUpdateDonggeUsedCount?.(newCount);
                  }}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={editDonggeCount}
                  onChange={(e) => setEditDonggeCount(e.target.value)}
                  className="text-center"
                  min="0"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={() => {
                    const newCount = donggeUsedCount + 1;
                    onUpdateDonggeUsedCount?.(newCount);
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDonggeModal(false)}>
              取消
            </Button>
            <Button onClick={handleUpdateDonggeCount}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 使用动画 */}
      <VoucherUseAnimation 
        key={selectedVoucher?.id ?? 'none'}
        voucher={selectedVoucher} 
        onComplete={handleCompleteAnimation}
        onConvert={handleConvert}
      />
    </div>
  );
}

// 统计卡片
interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
  showSettings?: boolean;
  highlight?: boolean;
}

function StatCard({ label, value, subValue, icon, color, onClick, showSettings, highlight }: StatCardProps) {
  return (
    <div 
      className={cn(
        'rounded-lg p-3 text-center relative',
        color.split(' ')[0],
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
        highlight && 'ring-2 ring-amber-400/50 bg-gradient-to-br from-amber-50 to-yellow-50'
      )}
      onClick={onClick}
    >
      {showSettings && (
        <Settings className="absolute top-2 right-2 w-3 h-3 opacity-50" />
      )}
      <div className={cn('flex items-center justify-center mb-1', color.split(' ')[1])}>
        {icon}
      </div>
      <div className={cn('text-2xl font-bold', highlight && 'text-amber-600')}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
      {subValue && (
        <div className="text-xs text-muted-foreground/70 mt-0.5">{subValue}</div>
      )}
    </div>
  );
}

// 筛选按钮
interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  type?: VoucherType;
  children: React.ReactNode;
}

function FilterButton({ active, onClick, type, children }: FilterButtonProps) {
  const getTypeColor = () => {
    if (!type) return '';
    switch (type) {
      case 'dongge': return 'bg-amber-500/20 text-amber-700 border-amber-300';
      case 'xiaoshuo': return 'bg-slate-400/20 text-slate-600 border-slate-300';
      case 'guansai': return 'bg-orange-400/20 text-orange-700 border-orange-300';
      case 'zixuan': return 'bg-purple-500/20 text-purple-700 border-purple-300';
      default: return '';
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1 text-xs rounded-full border transition-all',
        active 
          ? type 
            ? getTypeColor()
            : 'bg-primary/10 text-primary border-primary'
          : 'border-transparent hover:border-border'
      )}
    >
      {children}
    </button>
  );
}

// 列表项组件
interface VoucherListItemProps {
  voucher: Voucher;
  onUse: () => void;
}

function VoucherListItem({ voucher, onUse }: VoucherListItemProps) {
  const config = voucherTypeConfig[voucher.type];

  return (
    <div 
      className="flex items-center gap-4 p-3 rounded-lg border border-border hover:border-primary/30 cursor-pointer transition-colors"
      onClick={onUse}
    >
      <div className="text-3xl">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{voucher.name}</span>
          <Badge variant="outline" className={cn('text-xs', cn('bg-gradient-to-r', config.gradient, 'border-0'))}>
            {config.name}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">{voucher.description}</p>
      </div>
      <Button size="sm" variant="secondary" className="shrink-0">
        使用
      </Button>
    </div>
  );
}

export default Assets;
